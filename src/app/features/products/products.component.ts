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

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-products',
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
    <div class="products-container">
      <div class="products-header">
        <h1>Products Management</h1>
        <div class="header-actions">
          <button 
            mat-raised-button 
            color="primary"
            *hasPermission="'products.create'">
            <mat-icon>add</mat-icon>
            New Product
          </button>
        </div>
      </div>

      <mat-card class="products-card">
        <mat-card-content>
          <!-- Search and Filters -->
          <div class="filters-section">
            <div class="search-container">
              <app-search-input
                placeholder="Search products..."
                (valueChange)="onSearch($event)">
              </app-search-input>
            </div>
          </div>

          <!-- Products Grid -->
          <app-shared-grid
            [columns]="columns"
            [data]="products"
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
            <ng-template #statusTemplate let-product>
              <mat-chip 
                [class]="'status-chip status-' + product.status"
                [matTooltip]="getStatusTooltip(product.status)">
                {{ getStatusText(product.status) }}
              </mat-chip>
            </ng-template>

            <!-- Custom Stock Column -->
            <ng-template #stockTemplate let-product>
              <span 
                [class]="'stock-indicator ' + (product.stock < 10 ? 'low-stock' : 'normal-stock')">
                {{ product.stock }}
                <mat-icon 
                  *ngIf="product.stock < 10" 
                  class="warning-icon"
                  matTooltip="Low stock warning">
                  warning
                </mat-icon>
              </span>
            </ng-template>

            <!-- Custom Actions Column -->
            <ng-template #actionsTemplate let-product>
              <div class="action-buttons">
                <button 
                  mat-icon-button 
                  color="primary"
                  (click)="viewProduct(product)"
                  *hasPermission="'products.view'">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button 
                  mat-icon-button 
                  color="accent"
                  (click)="editProduct(product)"
                  *hasPermission="'products.edit'">
                  <mat-icon>edit</mat-icon>
                </button>
                <button 
                  mat-icon-button 
                  color="warn"
                  (click)="deleteProduct(product)"
                  *hasPermission="'products.delete'">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </ng-template>

            <!-- Toolbar Actions -->
            <div slot="right">
              <button 
                mat-button 
                color="warn"
                [disabled]="selectedProducts.length === 0"
                (click)="bulkDelete()"
                *hasPermission="'products.delete'">
                <mat-icon>delete</mat-icon>
                Delete Selected ({{ selectedProducts.length }})
              </button>
            </div>
          </app-shared-grid>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .products-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .products-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .products-header h1 {
      margin: 0;
      color: #333;
    }

    .products-card {
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

    .status-active {
      background-color: #d4edda;
      color: #155724;
    }

    .status-inactive {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-discontinued {
      background-color: #f8d7da;
      color: #721c24;
    }

    .stock-indicator {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .low-stock {
      color: #dc3545;
      font-weight: bold;
    }

    .normal-stock {
      color: #28a745;
    }

    .warning-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #ffc107;
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
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  totalRecords = 0;
  loading = false;
  pageSize = 10;
  selectedProducts: Product[] = [];

  columns: ColumnDef[] = [
    { field: 'id', header: 'Product ID', sortable: true, width: '120px' },
    { field: 'name', header: 'Name', sortable: true, filterable: true },
    { field: 'description', header: 'Description', sortable: true, filterable: true },
    { field: 'category', header: 'Category', sortable: true, filterable: true },
    { field: 'price', header: 'Price', sortable: true, type: 'number', width: '100px' },
    { 
      field: 'stock', 
      header: 'Stock', 
      sortable: true, 
      type: 'custom',
      template: 'stockTemplate',
      width: '100px'
    },
    { 
      field: 'status', 
      header: 'Status', 
      sortable: true, 
      type: 'custom',
      template: 'statusTemplate',
      width: '120px'
    },
    { field: 'createdAt', header: 'Created', sortable: true, type: 'date', width: '120px' },
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
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(searchTerm: string): void {
    console.log('Search:', searchTerm);
    // Implement search logic
    this.loadProducts();
  }

  onLazyLoad(event: any): void {
    console.log('Lazy load:', event);
    this.loadProducts(event.first / event.rows + 1, event.rows, event.sortField, event.sortOrder);
  }

  onSort(event: any): void {
    console.log('Sort:', event);
    this.loadProducts();
  }

  onSelectionChange(selected: Product[]): void {
    this.selectedProducts = selected;
  }

  onRefresh(): void {
    this.loadProducts();
  }

  viewProduct(product: Product): void {
    console.log('View product:', product);
    // Navigate to product detail
  }

  editProduct(product: Product): void {
    console.log('Edit product:', product);
    // Navigate to product edit
  }

  deleteProduct(product: Product): void {
    console.log('Delete product:', product);
    // Show confirmation dialog
  }

  bulkDelete(): void {
    console.log('Bulk delete:', this.selectedProducts);
    // Show confirmation dialog
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getStatusTooltip(status: string): string {
    const tooltips: Record<string, string> = {
      active: 'Product is active and available',
      inactive: 'Product is temporarily inactive',
      discontinued: 'Product has been discontinued'
    };
    return tooltips[status] || status;
  }

  private loadProducts(page: number = 1, size: number = 10, sortField?: string, sortOrder?: number): void {
    this.loading = true;
    
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.products = this.generateMockProducts();
      this.totalRecords = 100;
      this.loading = false;
    }, 1000);
  }

  private generateMockProducts(): Product[] {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'];
    const statuses: Product['status'][] = ['active', 'inactive', 'discontinued'];
    const products: Product[] = [];

    for (let i = 1; i <= 20; i++) {
      products.push({
        id: `PROD-${String(i).padStart(4, '0')}`,
        name: `Product ${i}`,
        description: `Description for product ${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 500) + 10,
        stock: Math.floor(Math.random() * 100),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }

    return products;
  }
}