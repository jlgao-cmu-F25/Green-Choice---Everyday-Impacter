import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <h1>🌱 Green Choice</h1>
          <div class="title-section">
            <h2>🌍 Everyday Impact Calculator</h2>
            <p class="tagline">Every small action counts!</p>
          </div>
        </div>
    
        @if (currentUser) {
          <div class="user-section">
            <div class="user-info">
              <span class="welcome-text">Welcome back,</span>
              <span class="username">{{ currentUser.username }}!</span>
            </div>
            <div class="user-stats">
              <div class="stat-item">
                <span class="stat-value">{{ currentUser.currentStreak }}</span>
                <span class="stat-label">Day Streak</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ currentUser.totalCO2Saved.toFixed(1) }}</span>
                <span class="stat-label">kg CO₂ Saved</span>
              </div>
            </div>
            <button class="logout-button" (click)="logout()">
              🚪 Logout
            </button>
          </div>
        }
      </div>
    </header>
    `,
  styles: [`
    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .logo-section h1 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
    }

    .title-section h2 {
      margin: 0 0 5px 0;
      font-size: 1.4rem;
      font-weight: 600;
      opacity: 0.95;
    }

    .title-section .tagline {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.8;
      font-style: italic;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .welcome-text {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .username {
      font-size: 1.2rem;
      font-weight: 600;
      margin-top: 2px;
    }

    .user-stats {
      display: flex;
      gap: 15px;
      padding: 10px 15px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stat-value {
      font-size: 1.2rem;
      font-weight: 700;
      color: #fff;
    }

    .stat-label {
      font-size: 0.7rem;
      opacity: 0.9;
      margin-top: 2px;
    }

    .logout-button {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .logout-button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .logo-section {
        flex-direction: column;
        gap: 15px;
      }

      .user-section {
        flex-direction: column;
        gap: 15px;
      }

      .user-info {
        align-items: center;
      }

      .user-stats {
        justify-content: center;
      }

      .logo-section h1 {
        font-size: 1.5rem;
      }

      .title-section h2 {
        font-size: 1.2rem;
      }

      .title-section .tagline {
        font-size: 0.8rem;
      }
    }

    @media (max-width: 480px) {
      .user-stats {
        gap: 10px;
        padding: 8px 12px;
      }

      .stat-value {
        font-size: 1rem;
      }

      .stat-label {
        font-size: 0.6rem;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}