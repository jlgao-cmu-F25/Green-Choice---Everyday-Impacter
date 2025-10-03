import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EcoAction, UserAction, UserStats, Impact } from '../models/eco-action.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAllActions(): Observable<EcoAction[]> {
    return this.http.get<EcoAction[]>(`${this.apiUrl}/actions`);
  }

  logAction(userId: string, actionId: string, quantity: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/actions/log`, {
      userId,
      actionId,
      quantity
    });
  }

  getUserActions(userId: string, period: 'today' | 'week' | 'month' = 'week'): Observable<{
    actions: UserAction[];
    totalImpact: Impact;
    insights: string[];
  }> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}/actions?period=${period}`);
  }

  getUserStats(userId: string): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/users/${userId}/stats`);
  }

  getLeaderboard(period: 'today' | 'week' | 'month' | 'alltime' = 'week', limit: number = 10) {
    return this.http.get<{ period: string; limit: number; leaderboard: any[] }>(
      `${this.apiUrl}/leaderboard?period=${period}&limit=${limit}`
    );
  }
}
