import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface User {
  userId: string;
  username: string;
  currentStreak: number;
  longestStreak: number;
  totalCO2Saved: number;
  totalWaterSaved: number;
  totalWasteSaved: number;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private showRegisterSubject = new BehaviorSubject<boolean>(false);
  public showRegister$ = this.showRegisterSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is stored in localStorage
    this.loadUserFromStorage();
  }

  register(username: string, password: string): Observable<AuthResponse> {
    return new Observable(observer => {
      this.http.post<AuthResponse>(`${this.apiUrl}/register`, { username, password })
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.setCurrentUser(response.user);
            }
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          }
        });
    });
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return new Observable(observer => {
      this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password })
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.setCurrentUser(response.user);
            }
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          }
        });
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.showRegisterSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  switchToRegister(): void {
    this.showRegisterSubject.next(true);
  }

  switchToLogin(): void {
    this.showRegisterSubject.next(false);
  }

  isShowingRegister(): boolean {
    return this.showRegisterSubject.value;
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
    }
  }

  // Update user data (for when stats change)
  updateUser(updatedUser: User): void {
    this.setCurrentUser(updatedUser);
  }
}