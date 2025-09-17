import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';

import { TenantContext, TenantInfo } from './tenant-context.service';
import { AppConfigService } from '../config/app-config.service';
import { AuthService } from '../auth/auth.service';
import { GlobalLoadingService } from '../ui/global-loading.service';

@Injectable({
  providedIn: 'root'
})
export class TenantInitializerService {
  constructor(
    private http: HttpClient,
    private tenantContext: TenantContext,
    private config: AppConfigService,
    private authService: AuthService,
    private loadingService: GlobalLoadingService
  ) {}

  async initialize(): Promise<void> {
    try {
      // Ensure config is loaded first
      if (!this.config.isLoaded) {
        await this.config.load();
      }

      const tenantMode = this.config.get('tenantMode');
      this.tenantContext.setMultiTenantMode(tenantMode ?? false);

      if (!tenantMode) {
        // Single tenant mode - set default tenant
        this.setDefaultTenant();
        return;
      }

      // Multi-tenant mode - resolve tenant
      const tenant = await this.resolveTenant();
      this.tenantContext.setTenant(tenant);

    } catch (error) {
      console.error('Tenant initialization failed:', error);
      // Fallback to default tenant
      this.setDefaultTenant();
    }
  }

  private async resolveTenant(): Promise<TenantInfo> {
    // Priority order: query param -> path segment -> subdomain -> JWT claim -> default

    // 1. Check query parameter
    const queryTenant = this.getTenantFromQueryParam();
    if (queryTenant) {
      return this.loadTenantById(queryTenant);
    }

    // 2. Check path segment
    const pathTenant = this.getTenantFromPath();
    if (pathTenant) {
      return this.loadTenantById(pathTenant);
    }

    // 3. Check subdomain
    const subdomainTenant = this.getTenantFromSubdomain();
    if (subdomainTenant) {
      return this.loadTenantById(subdomainTenant);
    }

    // 4. Check JWT claim
    const jwtTenant = this.getTenantFromJWT();
    if (jwtTenant) {
      return this.loadTenantById(jwtTenant);
    }

    // 5. Fallback to default tenant
    return this.getDefaultTenant();
  }

  private getTenantFromQueryParam(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tenant');
  }

  private getTenantFromPath(): string | null {
    const path = window.location.pathname;
    const tenantMatch = path.match(/^\/(?:t|tenant)\/([^\/]+)/);
    return tenantMatch ? tenantMatch[1] : null;
  }

  private getTenantFromSubdomain(): string | null {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // Skip 'www' and 'app' prefixes
    const tenantPart = parts.find(part => 
      !['www', 'app', 'localhost'].includes(part) && 
      parts.indexOf(part) < parts.length - 2
    );
    
    return tenantPart || null;
  }

  private getTenantFromJWT(): string | null {
    const user = this.authService.currentUser;
    return user?.tenantId || null;
  }

  private loadTenantById(tenantId: string): Promise<TenantInfo> {
    return this.http.get<TenantInfo>(`${this.config.getApiUrl()}/tenants/${tenantId}`)
      .pipe(
        catchError(error => {
          console.error(`Failed to load tenant ${tenantId}:`, error);
          return of(this.getDefaultTenant());
        })
      ).toPromise() as Promise<TenantInfo>;
  }

  private getDefaultTenant(): TenantInfo {
    return {
      id: 'default',
      name: 'Default Tenant',
      theme: {
        primary: '#3f51b5',
        secondary: '#ff4081'
      },
      config: {
        features: {
          orders: true,
          products: true,
          admin: false
        },
        settings: {}
      }
    };
  }

  private setDefaultTenant(): void {
    const defaultTenant = this.getDefaultTenant();
    this.tenantContext.setTenant(defaultTenant);
  }

  // Public method to switch tenant at runtime
  switchTenant(tenantId: string): Observable<TenantInfo> {
    return this.http.get<TenantInfo>(`${this.config.getApiUrl()}/tenants/${tenantId}`)
      .pipe(
        tap(tenant => {
          this.tenantContext.setTenant(tenant);
          // Update URL to reflect new tenant
          this.updateUrlForTenant(tenantId);
        }),
        catchError(error => {
          console.error(`Failed to switch to tenant ${tenantId}:`, error);
          return throwError(() => error);
        })
      );
  }

  private updateUrlForTenant(tenantId: string): void {
    const currentUrl = new URL(window.location.href);
    const pathSegments = currentUrl.pathname.split('/').filter(segment => segment);
    
    // Remove existing tenant path segments
    const filteredSegments = pathSegments.filter((segment, index) => {
      return !(index === 0 && ['t', 'tenant'].includes(segment));
    });
    
    // Add new tenant path
    const newPath = `/t/${tenantId}/${filteredSegments.join('/')}`;
    const newUrl = `${currentUrl.origin}${newPath}${currentUrl.search}`;
    
    // Update URL without page reload
    window.history.replaceState({}, '', newUrl);
  }
}