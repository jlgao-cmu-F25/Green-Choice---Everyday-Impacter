import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🌱 Green Choice</h1>
          <h2>Everyday Impacter</h2>
          <p>Track your eco-friendly actions and make a difference!</p>
        </div>
    
        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              [(ngModel)]="username"
              name="username"
              placeholder="Your username"
              class="form-input"
              [disabled]="isLoading"
              required
              >
            </div>
    
            <div class="form-group">
              <label for="password">Password</label>
              <input
                id="password"
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Your password"
                class="form-input"
                [disabled]="isLoading"
                required
                >
              </div>
    
              <button
                type="submit"
                class="login-button"
                [disabled]="!username.trim() || !password || isLoading"
                >
                @if (!isLoading) {
                  <span>🚀 Sign In</span>
                }
                @if (isLoading) {
                  <span>⏳ Signing In...</span>
                }
              </button>
    
              @if (errorMessage) {
                <div class="error-message">
                  {{ errorMessage }}
                </div>
              }
            </form>
    
            <div class="login-footer">
              <p>Don't have an account?</p>
              <button class="link-button" (click)="switchToRegister()" [disabled]="isLoading">
                Create Account
              </button>
            </div>
          </div>
        </div>
    `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 20px;
      padding: 40px 30px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      max-width: 420px;
      width: 100%;
      text-align: center;
    }

    .login-header h1 {
      font-size: 2.5rem;
      margin: 0 0 10px 0;
      color: #2d3748;
    }

    .login-header h2 {
      font-size: 1.5rem;
      margin: 0 0 15px 0;
      color: #4a5568;
      font-weight: 600;
    }

    .login-header p {
      color: #718096;
      margin-bottom: 30px;
      font-size: 1.1rem;
    }

    .form-group {
      margin-bottom: 25px;
      text-align: left;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #4a5568;
      font-weight: 500;
      font-size: 1.1rem;
    }

    .form-input {
      width: 100%;
      padding: 15px 20px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input:disabled {
      background-color: #f7fafc;
      cursor: not-allowed;
    }

    .link-button {
      background: none;
      border: none;
      color: #667eea;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
      transition: color 0.3s ease;
    }

    .link-button:hover:not(:disabled) {
      color: #764ba2;
    }

    .link-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .login-button {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px 20px;
      border-radius: 12px;
      font-size: 1.2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 20px;
    }

    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .error-message {
      background: #fed7d7;
      color: #c53030;
      padding: 12px;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-top: 15px;
    }

    .login-footer {
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .login-footer p {
      color: #718096;
      font-size: 0.9rem;
      margin: 0;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 30px 20px;
        margin: 10px;
      }
      
      .login-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.username.trim() || !this.password) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username.trim(), this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // Navigate to dashboard on successful login
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.error?.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
        console.error('Login error:', error);
      }
    });
  }

  switchToRegister() {
    this.router.navigate(['/register']);
  }
}