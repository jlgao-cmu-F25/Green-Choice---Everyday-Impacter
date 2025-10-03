import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h1>🌱 Join Green Choice</h1>
          <h2>Create Your Account</h2>
          <p>Start your eco-friendly journey today!</p>
        </div>
        
        <form (ngSubmit)="onRegister()" class="register-form">
          <div class="form-group">
            <label for="username">Choose a Username</label>
            <input 
              id="username"
              type="text" 
              [(ngModel)]="username" 
              name="username"
              placeholder="Your unique username"
              class="form-input"
              [disabled]="isLoading"
              required
              minlength="3"
              maxlength="20"
            >
            <small class="input-hint">3-20 characters, letters and numbers only</small>
          </div>
          
          <div class="form-group">
            <label for="password">Create a Password</label>
            <input 
              id="password"
              type="password" 
              [(ngModel)]="password" 
              name="password"
              placeholder="At least 6 characters"
              class="form-input"
              [disabled]="isLoading"
              required
              minlength="6"
            >
            <small class="input-hint">Minimum 6 characters</small>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              type="password" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword"
              placeholder="Repeat your password"
              class="form-input"
              [class.error]="confirmPassword && password !== confirmPassword"
              [disabled]="isLoading"
              required
            >
            <small class="input-hint error" *ngIf="confirmPassword && password !== confirmPassword">
              Passwords don't match
            </small>
          </div>
          
          <button 
            type="submit" 
            class="register-button"
            [disabled]="!canRegister() || isLoading"
          >
            <span *ngIf="!isLoading">🚀 Create Account</span>
            <span *ngIf="isLoading">⏳ Creating Account...</span>
          </button>
          
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
        
        <div class="register-footer">
          <p>Already have an account?</p>
          <button class="link-button" (click)="switchToLogin()" [disabled]="isLoading">
            Sign In Instead
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .register-card {
      background: white;
      border-radius: 20px;
      padding: 40px 30px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      max-width: 450px;
      width: 100%;
      text-align: center;
    }

    .register-header h1 {
      font-size: 2.5rem;
      margin: 0 0 10px 0;
      color: #2d3748;
    }

    .register-header h2 {
      font-size: 1.5rem;
      margin: 0 0 15px 0;
      color: #4a5568;
      font-weight: 600;
    }

    .register-header p {
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
      font-size: 1rem;
    }

    .form-input {
      width: 100%;
      padding: 15px 20px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input.error {
      border-color: #e53e3e;
    }

    .form-input:disabled {
      background-color: #f7fafc;
      cursor: not-allowed;
    }

    .input-hint {
      display: block;
      margin-top: 5px;
      color: #718096;
      font-size: 0.85rem;
    }

    .input-hint.error {
      color: #e53e3e;
    }

    .register-button {
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

    .register-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .register-button:disabled {
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

    .register-footer {
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .register-footer p {
      color: #718096;
      font-size: 0.9rem;
      margin: 0 0 10px 0;
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

    @media (max-width: 480px) {
      .register-card {
        padding: 30px 20px;
        margin: 10px;
      }
      
      .register-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  canRegister(): boolean {
    return this.username.trim().length >= 3 && 
           this.password.length >= 6 && 
           this.password === this.confirmPassword;
  }

  onRegister() {
    if (!this.canRegister()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.username.trim(), this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // Registration successful - AuthService will handle the state change
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        if (error.error?.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
        console.error('Registration error:', error);
      }
    });
  }

  switchToLogin() {
    this.authService.switchToLogin();
  }
}