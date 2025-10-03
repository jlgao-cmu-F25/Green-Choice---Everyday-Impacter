import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { AuthService, User } from '../../services/auth.service';
import { EcoAction, UserStats, Impact } from '../../models/eco-action.model';
import { HeaderComponent } from "../header/header.component";
import { BikeActionComponent } from '../bike-action/bike-action.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, HeaderComponent, BikeActionComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(BikeActionComponent) bikeActionComponent!: BikeActionComponent;
  
  currentUser: User | null = null;
  ecoActions: EcoAction[] = [];
  userStats: UserStats | null = null;
  todayImpact: Impact = { co2: 0, water: 0, waste: 0 };
  weekImpact: Impact = { co2: 0, water: 0, waste: 0 };
  insights: string[] = [];
  loading = true;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadData();
      }
    });
  }

  loadData() {
    if (!this.currentUser) return;
    
    this.loading = true;

    // Load available actions
    this.apiService.getAllActions().subscribe({
      next: (actions) => {
        this.ecoActions = actions;
      },
      error: (err) => console.error('Error loading actions:', err)
    });

    // Load user stats
    this.apiService.getUserStats(this.currentUser.userId).subscribe({
      next: (stats) => {
        this.userStats = stats;
      },
      error: (err) => {
        // User doesn't exist yet - that's okay
        console.log('No stats yet for user');
      }
    });

    // Load today's impact
    this.apiService.getUserActions(this.currentUser.userId, 'today').subscribe({
      next: (data) => {
        this.todayImpact = data.totalImpact;
      },
      error: (err) => console.log('No actions today yet')
    });

    // Load week's impact
    this.apiService.getUserActions(this.currentUser.userId, 'week').subscribe({
      next: (data) => {
        this.weekImpact = data.totalImpact;
        this.insights = data.insights;
        this.loading = false;
      },
      error: (err) => {
        console.log('No actions this week yet');
        this.loading = false;
      }
    });
  }

  logAction(action: EcoAction) {
    if (!this.currentUser) return;
    
    this.apiService.logAction(this.currentUser.userId, action._id).subscribe({
      next: (response) => {
        console.log('Action logged:', response);
        // Show insight
        if (response.insight && response.insight.length > 0) {
          alert('Great job! ' + response.insight[0]);
        }
        // Update user stats in auth service if they changed
        if (response.updatedUser) {
          this.authService.updateUser(response.updatedUser);
        }
        // Reload data
        this.loadData();
      },
      error: (err) => console.error('Error logging action:', err)
    });
  }

  // Calculate trees saved based on CO2 saved
  // Average tree absorbs about 21.77 kg of CO2 per year
  calculateTreesSaved(co2Saved: number): number {
    const co2PerTreePerYear = 21.77; // kg CO2 per tree per year
    return co2Saved / co2PerTreePerYear;
  }

  getTreesMessage(treesSaved: number): string {
    if (treesSaved < 0.1) {
      return "You're getting started! Keep going! 🌱";
    } else if (treesSaved < 0.5) {
      return "You've helped a young sapling grow! 🌿";
    } else if (treesSaved < 1) {
      return "Almost a full tree's worth of CO₂ saved! 🌳";
    } else if (treesSaved < 5) {
      const trees = Math.floor(treesSaved);
      return `Equivalent to ${trees} tree${trees > 1 ? 's' : ''} worth of CO₂ absorption! 🌲🌳`;
    } else if (treesSaved < 10) {
      return "You've saved a small forest! 🌲🌳🌲";
    } else {
      return "You're an environmental hero! 🌲🌳🌲🌿🌱";
    }
  }

  navigateToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  // Calculate progress percentage for today vs week
  getProgressPercentage(todayValue: number, weekValue: number): number {
    if (weekValue === 0) return 0;
    return Math.min(Math.round((todayValue / weekValue) * 100), 100);
  }

  showBikeAction() {
    this.bikeActionComponent.showModal();
  }

  onBikeRideLogged(event: {distance: number, co2Saved: number}) {
    if (!this.currentUser) return;

    // Log the bike ride using the dedicated API endpoint
    this.apiService.logBikeRide(this.currentUser.userId, event.distance, event.co2Saved).subscribe({
      next: (response) => {
        console.log('Bike ride logged:', response);
        
        // Show success message with insight
        let message = `Great job! You biked ${event.distance.toFixed(2)} km and saved ${event.co2Saved.toFixed(2)} kg of CO₂!`;
        if (response.insight && response.insight.length > 0) {
          message += '\n\n' + response.insight[0];
        }
        alert(message);
        
        // Update user stats in auth service if they changed
        if (response.updatedUser) {
          this.authService.updateUser(response.updatedUser);
        }
        
        // Reload data to get updated stats from server
        this.loadData();
      },
      error: (err) => {
        console.error('Error logging bike ride:', err);
        alert('There was an error logging your bike ride. Please try again.');
      }
    });
  }
}
