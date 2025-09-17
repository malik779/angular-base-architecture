import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil, combineLatest } from 'rxjs';

import { GlobalLoadingService } from './core/ui/global-loading.service';
import { AuthService } from './core/auth/auth.service';
import { TenantContext } from './core/tenant/tenant-context.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="app-container">
      <!-- Global Loading Overlay -->
      <div 
        *ngIf="isLoading" 
        class="global-loading-overlay"
        [class.hidden]="!isLoading">
        <div class="loading-content">
          <mat-spinner diameter="40"></mat-spinner>
          <p *ngIf="loadingMessage">{{ loadingMessage }}</p>
        </div>
      </div>

      <!-- App Content -->
      <div class="app-content" [class.loading]="isLoading">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      position: relative;
      min-height: 100vh;
      width: 100%;
    }

    .global-loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(2px);
      transition: opacity 0.3s ease-in-out;
    }

    .global-loading-overlay.hidden {
      opacity: 0;
      pointer-events: none;
    }

    .loading-content {
      text-align: center;
      color: #666;
    }

    .loading-content p {
      margin-top: 16px;
      font-size: 14px;
    }

    .app-content {
      transition: opacity 0.3s ease-in-out;
    }

    .app-content.loading {
      opacity: 0.7;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = false;
  loadingMessage = 'Loading...';

  private destroy$ = new Subject<void>();

  constructor(
    private loadingService: GlobalLoadingService,
    private authService: AuthService,
    private tenantContext: TenantContext
  ) {}

  ngOnInit(): void {
    // Subscribe to loading state
    this.loadingService.loadingState$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      this.isLoading = state.isLoading;
      this.loadingMessage = state.message || 'Loading...';
    });

    // Wait for app initialization before showing content
    combineLatest([
      this.authService.isInitialized$,
      this.tenantContext.tenant$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([authInitialized, tenant]) => {
      if (authInitialized && tenant) {
        // App is fully initialized
        console.log('App initialized with tenant:', tenant.name);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}