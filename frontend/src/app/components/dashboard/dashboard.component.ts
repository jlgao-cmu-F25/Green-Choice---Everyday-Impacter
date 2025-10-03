import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { AuthService, User } from '../../services/auth.service';
import { EcoAction, UserStats, Impact } from '../../models/eco-action.model';
import { HeaderComponent } from "../header/header.component";
import { BikeActionComponent } from '../bike-action/bike-action.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [HeaderComponent, BikeActionComponent],
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

  navigateToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  showBikeAction() {
    this.bikeActionComponent.showModal();
  }

  onBikeRideLogged(event: {distance: number, co2Saved: number}) {
    if (!this.currentUser) return;

    // For now, we'll simulate logging a bike action
    // In a real app, you'd probably want to create a custom endpoint for bike rides
    // or find an existing bike action to log with appropriate quantity
    
    // Show success message
    alert(`Great job! You biked ${event.distance.toFixed(2)} km and saved ${event.co2Saved.toFixed(2)} kg of CO₂!`);
    
    // Update the current impact locally (this would normally come from the server)
    this.todayImpact.co2 += event.co2Saved;
    this.weekImpact.co2 += event.co2Saved;
    
    // Optionally reload all data to get updated stats from server
    this.loadData();
  }
}
