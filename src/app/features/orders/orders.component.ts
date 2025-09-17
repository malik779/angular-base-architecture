import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { SharedGridComponent, ColumnDef } from '../../shared/components/shared-grid/shared-grid.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

export interface Order {
  id: string;
  customerName: string;
  email: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  orderDate: Date;
  items: number;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    SharedGridComponent,
    SearchInputComponent,
    HasPermissionDirective
  ],
  template: `
    <div class="orders-container">
      <div class="orders-header">
        <h1>Orders Management</h1>
        <div class="header-actions">
          <button 
            mat-raised-button 
            color="primary"
            *hasPermission="'orders.create'">
            <mat-icon>add</mat-icon>
            New Order
          </button>
        </div>
      </div>

      <mat-card class="orders-card">
        <mat-card-content>
          <!-- Search and Filters -->
          <div class="filters-section">
            <div class="search-container">
              <app-search-input
                placeholder="Search orders..."
                (valueChange)="onSearch($event)">
              </app-search-input>
            </div>
          </div>

          <!-- Orders Grid -->
          <app-shared-grid
            [columns]="columns"
            [data]="orders"
            [totalRecords]="totalRecords"
            [loading]="loading"
            [lazy]="true"
            [pageSize]="pageSize"
            [selectionMode]="'multiple'"
            (lazyLoad)="onLazyLoad($event)"
            (sort)="onSort($event)"
            (selectionChange)="onSelectionChange($event)"
            (refresh)="onRefresh()">
            
            <!-- Custom Status Column -->
            <ng-template #statusTemplate let-order>
              <mat-chip 
                [class]="'status-chip status-' + order.status"
                [matTooltip]="getStatusTooltip(order.status)">
                {{ getStatusText(order.status) }}
              </mat-chip>
            </ng-template>

            <!-- Custom Actions Column -->
            <ng-template #actionsTemplate let-order>
              <div class="action-buttons">
                <button 
                  mat-icon-button 
                  color="primary"
                  (click)="viewOrder(order)"
                  *hasPermission="'orders.view'">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button 
                  mat-icon-button 
                  color="accent"
                  (click)="editOrder(order)"
                  *hasPermission="'orders.edit'">
                  <mat-icon>edit</mat-icon>
                </button>
                <button 
                  mat-icon-button 
                  color="warn"
                  (click)="deleteOrder(order)"
                  *hasPermission="'orders.delete'">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </ng-template>

            <!-- Toolbar Actions -->
            <div slot="right">
              <button 
                mat-button 
                color="warn"
                [disabled]="selectedOrders.length === 0"
                (click)="bulkDelete()"
                *hasPermission="'orders.delete'">
                <mat-icon>delete</mat-icon>
                Delete Selected ({{ selectedOrders.length }})
              </button>
            </div>
          </app-shared-grid>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .orders-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .orders-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .orders-header h1 {
      margin: 0;
      color: #333;
    }

    .orders-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .filters-section {
      margin-bottom: 1rem;
    }

    .search-container {
      max-width: 400px;
    }

    .status-chip {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-processing {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .status-shipped {
      background-color: #d4edda;
      color: #155724;
    }

    .status-delivered {
      background-color: #cce5ff;
      color: #004085;
    }

    .status-cancelled {
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  totalRecords = 0;
  loading = false;
  pageSize = 10;
  selectedOrders: Order[] = [];

  columns: ColumnDef[] = [
    { field: 'id', header: 'Order ID', sortable: true, width: '120px' },
    { field: 'customerName', header: 'Customer', sortable: true, filterable: true },
    { field: 'email', header: 'Email', sortable: true, filterable: true },
    { 
      field: 'status', 
      header: 'Status', 
      sortable: true, 
      type: 'custom',
      template: 'statusTemplate',
      width: '120px'
    },
    { field: 'total', header: 'Total', sortable: true, type: 'number', width: '100px' },
    { field: 'orderDate', header: 'Order Date', sortable: true, type: 'date', width: '120px' },
    { field: 'items', header: 'Items', sortable: true, type: 'number', width: '80px' },
    { 
      field: 'actions', 
      header: 'Actions', 
      type: 'custom',
      template: 'actionsTemplate',
      width: '120px',
      align: 'center'
    }
  ];

  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(searchTerm: string): void {
    console.log('Search:', searchTerm);
    // Implement search logic
    this.loadOrders();
  }

  onLazyLoad(event: any): void {
    console.log('Lazy load:', event);
    this.loadOrders(event.first / event.rows + 1, event.rows, event.sortField, event.sortOrder);
  }

  onSort(event: any): void {
    console.log('Sort:', event);
    this.loadOrders();
  }

  onSelectionChange(selected: Order[]): void {
    this.selectedOrders = selected;
  }

  onRefresh(): void {
    this.loadOrders();
  }

  viewOrder(order: Order): void {
    console.log('View order:', order);
    // Navigate to order detail
  }

  editOrder(order: Order): void {
    console.log('Edit order:', order);
    // Navigate to order edit
  }

  deleteOrder(order: Order): void {
    console.log('Delete order:', order);
    // Show confirmation dialog
  }

  bulkDelete(): void {
    console.log('Bulk delete:', this.selectedOrders);
    // Show confirmation dialog
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getStatusTooltip(status: string): string {
    const tooltips: Record<string, string> = {
      pending: 'Order is pending processing',
      processing: 'Order is being processed',
      shipped: 'Order has been shipped',
      delivered: 'Order has been delivered',
      cancelled: 'Order has been cancelled'
    };
    return tooltips[status] || status;
  }

  private loadOrders(page: number = 1, size: number = 10, sortField?: string, sortOrder?: number): void {
    this.loading = true;
    
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.orders = this.generateMockOrders();
      this.totalRecords = 100;
      this.loading = false;
    }, 1000);
  }

  private generateMockOrders(): Order[] {
    const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const orders: Order[] = [];

    for (let i = 1; i <= 20; i++) {
      orders.push({
        id: `ORD-${String(i).padStart(4, '0')}`,
        customerName: `Customer ${i}`,
        email: `customer${i}@example.com`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        total: Math.floor(Math.random() * 1000) + 50,
        orderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        items: Math.floor(Math.random() * 10) + 1
      });
    }

    return orders;
  }
}