import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'leaderboard', 
    loadComponent: () => import('./components/leaderboard-page/leaderboard-page.component').then(m => m.LeaderboardPageComponent) 
  },
  { path: '', pathMatch: 'full', redirectTo: '' }
];
