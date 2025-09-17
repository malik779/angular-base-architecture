import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="not-found-container">
      <mat-card class="not-found-card">
        <mat-card-content class="not-found-content">
          <mat-icon class="error-icon">search_off</mat-icon>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <p class="secondary-text">Error 404</p>
          
          <div class="action-buttons">
            <button mat-raised-button color="primary" routerLink="/dashboard">
              <mat-icon>home</mat-icon>
              Go to Dashboard
            </button>
            <button mat-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Go Back
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .not-found-card {
      max-width: 500px;
      width: 100%;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .not-found-content {
      padding: 3rem 2rem;
    }

    .error-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ff9800;
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
export class NotFoundComponent {
  goBack(): void {
    window.history.back();
  }
}