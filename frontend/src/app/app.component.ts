import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, DashboardComponent, LoginComponent, HeaderComponent],
  template: `
    <div class="app-container" *ngIf="!isLoading">
      <div *ngIf="!isLoggedIn" class="auth-view">
        <app-login></app-login>
      </div>
      
      <div *ngIf="isLoggedIn" class="main-view">
        <app-header></app-header>
        <main class="main-content">
          <app-dashboard></app-dashboard>
        </main>
      </div>
    </div>
    
    <div *ngIf="isLoading" class="loading-container">
      <div class="loading-spinner">⏳</div>
      <p>Loading...</p>
    </div>
    
    <router-outlet />
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
    }

    .auth-view {
      min-height: 100vh;
    }

    .main-view {
      min-height: 100vh;
      background: #f5f7fa;
    }

    .main-content {
      min-height: calc(100vh - 100px);
    }

    .loading-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
    }

    .loading-spinner {
      font-size: 3rem;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .loading-container p {
      margin-top: 20px;
      color: #718096;
      font-size: 1.1rem;
    }
  `],
})
export class AppComponent implements OnInit {
  title = 'everyday-impact-frontend';
  isLoggedIn = false;
  isLoading = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Small delay to let the auth service initialize
    setTimeout(() => {
      this.authService.isLoggedIn$.subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
        this.isLoading = false;
      });
    }, 100);
  }
}
