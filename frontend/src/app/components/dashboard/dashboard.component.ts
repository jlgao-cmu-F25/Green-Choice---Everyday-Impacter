import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { EcoAction, UserStats, Impact } from '../../models/eco-action.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userId = 'demo-user'; // For hackathon, using a default user
  ecoActions: EcoAction[] = [];
  userStats: UserStats | null = null;
  todayImpact: Impact = { co2: 0, water: 0, waste: 0 };
  weekImpact: Impact = { co2: 0, water: 0, waste: 0 };
  insights: string[] = [];
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    // Load available actions
    this.apiService.getAllActions().subscribe({
      next: (actions) => {
        this.ecoActions = actions;
      },
      error: (err) => console.error('Error loading actions:', err)
    });

    // Load user stats
    this.apiService.getUserStats(this.userId).subscribe({
      next: (stats) => {
        this.userStats = stats;
      },
      error: (err) => {
        // User doesn't exist yet - that's okay
        console.log('No stats yet for user');
      }
    });

    // Load today's impact
    this.apiService.getUserActions(this.userId, 'today').subscribe({
      next: (data) => {
        this.todayImpact = data.totalImpact;
      },
      error: (err) => console.log('No actions today yet')
    });

    // Load week's impact
    this.apiService.getUserActions(this.userId, 'week').subscribe({
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
    this.apiService.logAction(this.userId, action._id).subscribe({
      next: (response) => {
        console.log('Action logged:', response);
        // Show insight
        if (response.insight && response.insight.length > 0) {
          alert('Great job! ' + response.insight[0]);
        }
        // Reload data
        this.loadData();
      },
      error: (err) => console.error('Error logging action:', err)
    });
  }
}
