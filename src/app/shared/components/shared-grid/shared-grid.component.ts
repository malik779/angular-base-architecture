import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ToolbarModule } from 'primeng/toolbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

export interface ColumnDef {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
  template?: any;
  align?: 'left' | 'center' | 'right';
}

export interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

export interface SortEvent {
  field: string;
  order: 1 | -1;
}

export interface FilterEvent {
  field: string;
  value: any;
}

@Component({
  selector: 'app-shared-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    ToolbarModule,
    ProgressSpinnerModule
  ],
  template: `
    <div class="shared-grid">
      <!-- Toolbar -->
      <p-toolbar *ngIf="showToolbar" class="grid-toolbar">
        <ng-template pTemplate="left">
          <div class="toolbar-left">
            <ng-content select="[slot=left]"></ng-content>
          </div>
        </ng-template>
        <ng-template pTemplate="right">
          <div class="toolbar-right">
            <ng-content select="[slot=right]"></ng-content>
            <p-button 
              *ngIf="showRefresh"
              icon="pi pi-refresh" 
              [text]="true"
              (onClick)="refresh()"
              pTooltip="Refresh">
            </p-button>
          </div>
        </ng-template>
      </p-toolbar>

      <!-- Table -->
      <p-table
        [value]="data"
        [columns]="columns"
        [paginator]="paginator"
        [rows]="pageSize"
        [totalRecords]="totalRecords"
        [loading]="loading"
        [lazy]="lazy"
        [sortField]="sortField"
        [sortOrder]="sortOrder"
        [selectionMode]="selectionMode"
        [(selection)]="selectedItems"
        [rowHover]="true"
        [showCurrentPageReport]="showCurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        [rowsPerPageOptions]="pageSizeOptions"
        (onLazyLoad)="onLazyLoad($event)"
        (onSort)="onSort($event)"
        (onSelectionChange)="onSelectionChange($event)"
        styleClass="p-datatable-sm">
        
        <!-- Column Templates -->
        <ng-container *ngFor="let col of columns">
          <ng-container [ngSwitch]="col.type">
            
            <!-- Text Column -->
            <ng-container *ngSwitchCase="'text'">
              <ng-template pTemplate="header" let-col>
                {{ col.header }}
                <p-inputText 
                  *ngIf="col.filterable"
                  [ngModel]="filters[col.field]"
                  (ngModelChange)="onFilter(col.field, $event)"
                  [placeholder]="'Search ' + col.header"
                  class="column-filter">
                </p-inputText>
              </ng-template>
              <ng-template pTemplate="body" let-rowData let-col>
                {{ rowData[col.field] }}
              </ng-template>
            </ng-container>

            <!-- Number Column -->
            <ng-container *ngSwitchCase="'number'">
              <ng-template pTemplate="header" let-col>
                {{ col.header }}
                <p-inputText 
                  *ngIf="col.filterable"
                  [ngModel]="filters[col.field]"
                  (ngModelChange)="onFilter(col.field, $event)"
                  [placeholder]="'Search ' + col.header"
                  class="column-filter">
                </p-inputText>
              </ng-template>
              <ng-template pTemplate="body" let-rowData let-col>
                {{ rowData[col.field] | number }}
              </ng-template>
            </ng-container>

            <!-- Date Column -->
            <ng-container *ngSwitchCase="'date'">
              <ng-template pTemplate="header" let-col>
                {{ col.header }}
              </ng-template>
              <ng-template pTemplate="body" let-rowData let-col>
                {{ rowData[col.field] | date:'short' }}
              </ng-template>
            </ng-container>

            <!-- Boolean Column -->
            <ng-container *ngSwitchCase="'boolean'">
              <ng-template pTemplate="header" let-col>
                {{ col.header }}
              </ng-template>
              <ng-template pTemplate="body" let-rowData let-col>
                <i [class]="rowData[col.field] ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
              </ng-template>
            </ng-container>

            <!-- Custom Column -->
            <ng-container *ngSwitchCase="'custom'">
              <ng-template pTemplate="header" let-col>
                {{ col.header }}
              </ng-template>
              <ng-template pTemplate="body" let-rowData let-col>
                <ng-container [ngTemplateOutlet]="col.template" [ngTemplateOutletContext]="{ $implicit: rowData, col: col }"></ng-container>
              </ng-template>
            </ng-container>

            <!-- Default Column -->
            <ng-container *ngSwitchDefault>
              <ng-template pTemplate="header" let-col>
                {{ col.header }}
              </ng-template>
              <ng-template pTemplate="body" let-rowData let-col>
                {{ rowData[col.field] }}
              </ng-template>
            </ng-container>

          </ng-container>
        </ng-container>

        <!-- Empty State -->
        <ng-template pTemplate="emptymessage">
          <div class="empty-state">
            <i class="pi pi-inbox text-4xl text-gray-400"></i>
            <p class="text-gray-500 mt-2">No data found</p>
          </div>
        </ng-template>

        <!-- Loading State -->
        <ng-template pTemplate="loadingbody">
          <tr>
            <td [attr.colspan]="columns.length" class="text-center p-4">
              <p-progressSpinner [style]="{ width: '50px', height: '50px' }"></p-progressSpinner>
            </td>
          </tr>
        </ng-template>

      </p-table>
    </div>
  `,
  styles: [`
    .shared-grid {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .grid-toolbar {
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem;
    }

    .toolbar-left, .toolbar-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .column-filter {
      width: 100%;
      margin-top: 0.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
    }

    :host ::ng-deep .p-datatable {
      .p-datatable-header {
        background: #f8f9fa;
        border-bottom: 1px solid #e5e7eb;
      }

      .p-datatable-tbody > tr {
        transition: background-color 0.2s;
      }

      .p-datatable-tbody > tr:hover {
        background: #f8f9fa;
      }

      .p-datatable-tbody > tr.p-highlight {
        background: #e3f2fd;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedGridComponent<T = any> implements OnInit, OnDestroy {
  @Input() columns: ColumnDef[] = [];
  @Input() data: T[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
  @Input() lazy = true;
  @Input() paginator = true;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 50];
  @Input() showToolbar = true;
  @Input() showRefresh = true;
  @Input() showCurrentPageReport = true;
  @Input() selectionMode: 'single' | 'multiple' | null = null;
  @Input() sortField = '';
  @Input() sortOrder: 1 | -1 = 1;

  @Output() lazyLoad = new EventEmitter<any>();
  @Output() sort = new EventEmitter<SortEvent>();
  @Output() filter = new EventEmitter<FilterEvent>();
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() refresh = new EventEmitter<void>();

  selectedItems: T[] = [];
  filters: Record<string, any> = {};

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Initialize filters
    this.columns.forEach(col => {
      if (col.filterable) {
        this.filters[col.field] = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLazyLoad(event: any): void {
    this.lazyLoad.emit(event);
  }

  onSort(event: any): void {
    this.sort.emit({
      field: event.field,
      order: event.order
    });
  }

  onFilter(field: string, value: any): void {
    this.filters[field] = value;
    this.filter.emit({ field, value });
  }

  onSelectionChange(event: any): void {
    this.selectedItems = event;
    this.selectionChange.emit(this.selectedItems);
  }

  refresh(): void {
    this.refresh.emit();
  }

  clearFilters(): void {
    Object.keys(this.filters).forEach(key => {
      this.filters[key] = '';
    });
  }

  clearSelection(): void {
    this.selectedItems = [];
    this.selectionChange.emit(this.selectedItems);
  }
}