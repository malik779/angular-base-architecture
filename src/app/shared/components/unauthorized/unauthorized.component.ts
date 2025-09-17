import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="unauthorized-container">
      <mat-card class="unauthorized-card">
        <mat-card-content class="unauthorized-content">
          <mat-icon class="error-icon">block</mat-icon>
          <h1>Access Denied</h1>
          <p>You don't have permission to access this resource.</p>
          <p class="secondary-text">Please contact your administrator if you believe this is an error.</p>
          
          <div class="action-buttons">
            <button mat-raised-button color="primary" routerLink="/dashboard">
              <mat-icon>home</mat-icon>
              Go to Dashboard
            </button>
            <button mat-button routerLink="/auth/login">
              <mat-icon>login</mat-icon>
              Sign In
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .unauthorized-card {
      max-width: 500px;
      width: 100%;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .unauthorized-content {
      padding: 3rem 2rem;
    }

    .error-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #f44336;
      margin-bottom: 1rem;
    }

    h1 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 2rem;
    }

    p {
      color: #666;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .secondary-text {
      font-size: 0.9rem;
      color: #999;
    }

    .action-buttons {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .action-buttons button {
      height: 48px;
      font-size: 16px;
    }
  `]
})
export class UnauthorizedComponent {}