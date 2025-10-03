import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
            <label for="username">Enter your username</label>
            <input 
              id="username"
              type="text" 
              [(ngModel)]="username" 
              name="username"
              placeholder="Your username"
              class="username-input"
              [disabled]="isLoading"
              required
            >
          </div>
          
          <button 
            type="submit" 
            class="login-button"
            [disabled]="!username.trim() || isLoading"
          >
            <span *ngIf="!isLoading">🚀 Get Started</span>
            <span *ngIf="isLoading">⏳ Loading...</span>
          </button>
          
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
        
        <div class="login-footer">
          <p>New user? Don't worry! We'll create an account for you automatically.</p>
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

    .username-input {
      width: 100%;
      padding: 15px 20px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .username-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .username-input:disabled {
      background-color: #f7fafc;
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
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    if (!this.username.trim()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username.trim()).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // Login successful - AuthService will handle the state change
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Something went wrong. Please try again.';
        console.error('Login error:', error);
      }
    });
  }
}