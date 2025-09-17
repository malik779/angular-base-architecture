import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, combineLatest } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/auth/auth.service';
import { TenantContext } from '../../core/tenant/tenant-context.service';
import { HasRoleDirective } from '../../core/directives/has-role.directive';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HasRoleDirective,
    HasPermissionDirective
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <div class="user-info">
          <span>Welcome, {{ currentUser?.name || 'User' }}!</span>
          <span *ngIf="tenant" class="tenant-info">Tenant: {{ tenant.name }}</span>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon">shopping_cart</mat-icon>
                <div class="stat-info">
                  <h3>Orders</h3>
                  <p class="stat-number">{{ stats.orders }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon">inventory</mat-icon>
                <div class="stat-info">
                  <h3>Products</h3>
                  <p class="stat-number">{{ stats.products }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon">people</mat-icon>
                <div class="stat-info">
                  <h3>Users</h3>
                  <p class="stat-number">{{ stats.users }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <mat-icon class="stat-icon">trending_up</mat-icon>
                <div class="stat-info">
                  <h3>Revenue</h3>
                  <p class="stat-number">${{ stats.revenue | number }}</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="actions-grid">
          <mat-card class="action-card">
            <mat-card-header>
              <mat-card-title>Quick Actions</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="action-buttons">
                <button 
                  mat-raised-button 
                  color="primary"
                  routerLink="/orders"
                  *hasPermission="'orders.view'">
                  <mat-icon>shopping_cart</mat-icon>
                  View Orders
                </button>
                
                <button 
                  mat-raised-button 
                  color="accent"
                  routerLink="/products"
                  *hasPermission="'products.view'">
                  <mat-icon>inventory</mat-icon>
                  Manage Products
                </button>
                
                <button 
                  mat-raised-button 
                  color="warn"
                  routerLink="/admin"
                  *hasRole="'admin'">
                  <mat-icon>admin_panel_settings</mat-icon>
                  Admin Panel
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="action-card">
            <mat-card-header>
              <mat-card-title>Recent Activity</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="activity-list">
                <div *ngFor="let activity of recentActivity" class="activity-item">
                  <mat-icon class="activity-icon">{{ activity.icon }}</mat-icon>
                  <div class="activity-content">
                    <p class="activity-text">{{ activity.text }}</p>
                    <span class="activity-time">{{ activity.time }}</span>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      margin: 0;
      color: #333;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      color: #666;
    }

    .tenant-info {
      font-size: 0.875rem;
      color: #999;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .stat-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      opacity: 0.9;
    }

    .stat-number {
      margin: 0;
      font-size: 2rem;
      font-weight: bold;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1rem;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .action-buttons button {
      justify-content: flex-start;
      height: 48px;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem 0;
    }

    .activity-icon {
      color: #666;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      margin: 0 0 0.25rem 0;
      color: #333;
    }

    .activity-time {
      font-size: 0.875rem;
      color: #999;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  tenant: any = null;
  stats = {
    orders: 0,
    products: 0,
    users: 0,
    revenue: 0
  };
  recentActivity = [
    { icon: 'shopping_cart', text: 'New order #1234 created', time: '2 hours ago' },
    { icon: 'person_add', text: 'New user registered', time: '4 hours ago' },
    { icon: 'inventory', text: 'Product inventory updated', time: '6 hours ago' },
    { icon: 'payment', text: 'Payment processed', time: '8 hours ago' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private tenantContext: TenantContext
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.authService.user$,
      this.tenantContext.tenant$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([user, tenant]) => {
      this.currentUser = user;
      this.tenant = tenant;
      
      // Load dashboard stats
      this.loadStats();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStats(): void {
    // Mock data - replace with actual API calls
    this.stats = {
      orders: 156,
      products: 89,
      users: 234,
      revenue: 45678
    };
  }
}