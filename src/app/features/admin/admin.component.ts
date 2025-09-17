import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

import { SharedGridComponent, ColumnDef } from '../../shared/components/shared-grid/shared-grid.component';
import { HasRoleDirective } from '../../core/directives/has-role.directive';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  createdAt: Date;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
    MatChipsModule,
    SharedGridComponent,
    HasRoleDirective,
    HasPermissionDirective
  ],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>Admin Panel</h1>
        <div class="header-actions">
          <button 
            mat-raised-button 
            color="primary"
            *hasPermission="'admin.users.create'">
            <mat-icon>person_add</mat-icon>
            Add User
          </button>
        </div>
      </div>

      <mat-card class="admin-card">
        <mat-card-content>
          <mat-tab-group>
            <!-- Users Tab -->
            <mat-tab label="Users">
              <div class="tab-content">
                <div class="tab-header">
                  <h3>User Management</h3>
                  <div class="tab-actions">
                    <button 
                      mat-button 
                      color="primary"
                      (click)="refreshUsers()">
                      <mat-icon>refresh</mat-icon>
                      Refresh
                    </button>
                  </div>
                </div>

                <app-shared-grid
                  [columns]="userColumns"
                  [data]="users"
                  [totalRecords]="totalUsers"
                  [loading]="usersLoading"
                  [lazy]="true"
                  [pageSize]="pageSize"
                  [selectionMode]="'multiple'"
                  (lazyLoad)="onUsersLazyLoad($event)"
                  (sort)="onUsersSort($event)"
                  (selectionChange)="onUsersSelectionChange($event)">
                  
                  <!-- Custom Status Column -->
                  <ng-template #userStatusTemplate let-user>
                    <mat-chip 
                      [class]="'status-chip status-' + user.status"
                      [matTooltip]="getUserStatusTooltip(user.status)">
                      {{ getUserStatusText(user.status) }}
                    </mat-chip>
                  </ng-template>

                  <!-- Custom Role Column -->
                  <ng-template #userRoleTemplate let-user>
                    <mat-chip 
                      [class]="'role-chip role-' + user.role.toLowerCase()">
                      {{ getUserRoleText(user.role) }}
                    </mat-chip>
                  </ng-template>

                  <!-- Custom Actions Column -->
                  <ng-template #userActionsTemplate let-user>
                    <div class="action-buttons">
                      <button 
                        mat-icon-button 
                        color="primary"
                        (click)="viewUser(user)"
                        *hasPermission="'admin.users.view'">
                        <mat-icon>visibility</mat-icon>
                      </button>
                      <button 
                        mat-icon-button 
                        color="accent"
                        (click)="editUser(user)"
                        *hasPermission="'admin.users.edit'">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button 
                        mat-icon-button 
                        color="warn"
                        (click)="deleteUser(user)"
                        *hasPermission="'admin.users.delete'">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </ng-template>
                </app-shared-grid>
              </div>
            </mat-tab>

            <!-- System Settings Tab -->
            <mat-tab label="System Settings">
              <div class="tab-content">
                <div class="settings-section">
                  <h3>Application Settings</h3>
                  <mat-list>
                    <mat-list-item>
                      <mat-icon matListIcon>settings</mat-icon>
                      <div matLine>Application Name</div>
                      <div matLine class="secondary">Angular Multi-Tenant App</div>
                    </mat-list-item>
                    <mat-list-item>
                      <mat-icon matListIcon>security</mat-icon>
                      <div matLine>Security Level</div>
                      <div matLine class="secondary">High</div>
                    </mat-list-item>
                    <mat-list-item>
                      <mat-icon matListIcon>storage</mat-icon>
                      <div matLine>Database</div>
                      <div matLine class="secondary">PostgreSQL</div>
                    </mat-list-item>
                  </mat-list>
                </div>

                <div class="settings-section">
                  <h3>Feature Flags</h3>
                  <div class="feature-flags">
                    <mat-list>
                      <mat-list-item *ngFor="let feature of featureFlags">
                        <mat-icon matListIcon>{{ feature.enabled ? 'check_circle' : 'cancel' }}</mat-icon>
                        <div matLine>{{ feature.name }}</div>
                        <div matLine class="secondary">{{ feature.description }}</div>
                        <mat-chip 
                          [class]="feature.enabled ? 'enabled-chip' : 'disabled-chip'">
                          {{ feature.enabled ? 'Enabled' : 'Disabled' }}
                        </mat-chip>
                      </mat-list-item>
                    </mat-list>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- Audit Log Tab -->
            <mat-tab label="Audit Log">
              <div class="tab-content">
                <div class="tab-header">
                  <h3>System Audit Log</h3>
                  <div class="tab-actions">
                    <button 
                      mat-button 
                      color="primary"
                      (click)="refreshAuditLog()">
                      <mat-icon>refresh</mat-icon>
                      Refresh
                    </button>
                  </div>
                </div>

                <app-shared-grid
                  [columns]="auditColumns"
                  [data]="auditLogs"
                  [totalRecords]="totalAuditLogs"
                  [loading]="auditLoading"
                  [lazy]="true"
                  [pageSize]="pageSize"
                  (lazyLoad)="onAuditLazyLoad($event)"
                  (sort)="onAuditSort($event)">
                </app-shared-grid>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .admin-header h1 {
      margin: 0;
      color: #333;
    }

    .admin-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .tab-content {
      padding: 1rem 0;
    }

    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .tab-header h3 {
      margin: 0;
      color: #333;
    }

    .settings-section {
      margin-bottom: 2rem;
    }

    .settings-section h3 {
      color: #333;
      margin-bottom: 1rem;
    }

    .feature-flags {
      margin-top: 1rem;
    }

    .status-chip {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-active {
      background-color: #d4edda;
      color: #155724;
    }

    .status-inactive {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-suspended {
      background-color: #f8d7da;
      color: #721c24;
    }

    .role-chip {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .role-admin {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .role-user {
      background-color: #e2e3e5;
      color: #383d41;
    }

    .role-manager {
      background-color: #d4edda;
      color: #155724;
    }

    .enabled-chip {
      background-color: #d4edda;
      color: #155724;
    }

    .disabled-chip {
      background-color: #f8d7da;
      color: #721c24;
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
    }

    .action-buttons button {
      width: 32px;
      height: 32px;
      line-height: 32px;
    }

    .action-buttons mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .secondary {
      color: #666;
      font-size: 0.875rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit, OnDestroy {
  users: User[] = [];
  totalUsers = 0;
  usersLoading = false;
  selectedUsers: User[] = [];

  auditLogs: any[] = [];
  totalAuditLogs = 0;
  auditLoading = false;

  pageSize = 10;

  featureFlags = [
    { name: 'Orders Module', description: 'Enable orders management', enabled: true },
    { name: 'Products Module', description: 'Enable products management', enabled: true },
    { name: 'Reports Module', description: 'Enable reporting features', enabled: false },
    { name: 'Analytics Module', description: 'Enable analytics dashboard', enabled: false }
  ];

  userColumns: ColumnDef[] = [
    { field: 'id', header: 'User ID', sortable: true, width: '120px' },
    { field: 'name', header: 'Name', sortable: true, filterable: true },
    { field: 'email', header: 'Email', sortable: true, filterable: true },
    { 
      field: 'role', 
      header: 'Role', 
      sortable: true, 
      type: 'custom',
      template: 'userRoleTemplate',
      width: '100px'
    },
    { 
      field: 'status', 
      header: 'Status', 
      sortable: true, 
      type: 'custom',
      template: 'userStatusTemplate',
      width: '120px'
    },
    { field: 'lastLogin', header: 'Last Login', sortable: true, type: 'date', width: '120px' },
    { field: 'createdAt', header: 'Created', sortable: true, type: 'date', width: '120px' },
    { 
      field: 'actions', 
      header: 'Actions', 
      type: 'custom',
      template: 'userActionsTemplate',
      width: '120px',
      align: 'center'
    }
  ];

  auditColumns: ColumnDef[] = [
    { field: 'timestamp', header: 'Timestamp', sortable: true, type: 'date', width: '150px' },
    { field: 'user', header: 'User', sortable: true, filterable: true },
    { field: 'action', header: 'Action', sortable: true, filterable: true },
    { field: 'resource', header: 'Resource', sortable: true, filterable: true },
    { field: 'ipAddress', header: 'IP Address', sortable: true, width: '120px' },
    { field: 'userAgent', header: 'User Agent', sortable: true }
  ];

  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadAuditLogs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  refreshAuditLog(): void {
    this.loadAuditLogs();
  }

  onUsersLazyLoad(event: any): void {
    this.loadUsers(event.first / event.rows + 1, event.rows, event.sortField, event.sortOrder);
  }

  onUsersSort(event: any): void {
    this.loadUsers();
  }

  onUsersSelectionChange(selected: User[]): void {
    this.selectedUsers = selected;
  }

  onAuditLazyLoad(event: any): void {
    this.loadAuditLogs(event.first / event.rows + 1, event.rows, event.sortField, event.sortOrder);
  }

  onAuditSort(event: any): void {
    this.loadAuditLogs();
  }

  viewUser(user: User): void {
    console.log('View user:', user);
  }

  editUser(user: User): void {
    console.log('Edit user:', user);
  }

  deleteUser(user: User): void {
    console.log('Delete user:', user);
  }

  getUserStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getUserStatusTooltip(status: string): string {
    const tooltips: Record<string, string> = {
      active: 'User is active and can log in',
      inactive: 'User account is inactive',
      suspended: 'User account is suspended'
    };
    return tooltips[status] || status;
  }

  getUserRoleText(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  private loadUsers(page: number = 1, size: number = 10, sortField?: string, sortOrder?: number): void {
    this.usersLoading = true;
    
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.users = this.generateMockUsers();
      this.totalUsers = 50;
      this.usersLoading = false;
    }, 1000);
  }

  private loadAuditLogs(page: number = 1, size: number = 10, sortField?: string, sortOrder?: number): void {
    this.auditLoading = true;
    
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.auditLogs = this.generateMockAuditLogs();
      this.totalAuditLogs = 200;
      this.auditLoading = false;
    }, 1000);
  }

  private generateMockUsers(): User[] {
    const roles = ['admin', 'manager', 'user'];
    const statuses: User['status'][] = ['active', 'inactive', 'suspended'];
    const users: User[] = [];

    for (let i = 1; i <= 20; i++) {
      users.push({
        id: `USER-${String(i).padStart(4, '0')}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        role: roles[Math.floor(Math.random() * roles.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      });
    }

    return users;
  }

  private generateMockAuditLogs(): any[] {
    const actions = ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW'];
    const resources = ['USER', 'ORDER', 'PRODUCT', 'SETTINGS'];
    const logs: any[] = [];

    for (let i = 1; i <= 20; i++) {
      logs.push({
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        user: `User ${i}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        resource: resources[Math.floor(Math.random() * resources.length)],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      });
    }

    return logs;
  }
}