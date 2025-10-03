import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-leaderboard-page',
  standalone: true,
  imports: [],
  templateUrl: './leaderboard-page.component.html',
  styleUrls: ['./leaderboard-page.component.css']
})
export class LeaderboardPageComponent implements OnInit {
  leaderboard: { userId: string; username: string; totalCO2: number; totalWater: number; totalWaste: number }[] = [];
  loading = false;
  error: string | null = null;
  selectedPeriod: 'today' | 'week' | 'month' | 'alltime' = 'week';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLeaderboard();
  }

  changePeriod(period: 'today' | 'week' | 'month' | 'alltime') {
    this.selectedPeriod = period;
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.loading = true;
    this.error = null;
    
    this.apiService.getLeaderboard(this.selectedPeriod, 20).subscribe({
      next: (res) => {
        this.leaderboard = res.leaderboard;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load leaderboard';
        this.loading = false;
        console.error('Error loading leaderboard:', err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}