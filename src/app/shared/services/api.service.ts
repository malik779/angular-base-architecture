import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, shareReplay } from 'rxjs/operators';

import { AppConfigService } from '../../core/config/app-config.service';
import { TenantContext } from '../../core/tenant/tenant-context.service';
import { GlobalLoadingService } from '../../core/ui/global-loading.service';
import { SnackbarService } from '../../core/ui/snackbar.service';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  observe?: 'body' | 'response';
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  constructor(
    private http: HttpClient,
    private config: AppConfigService,
    private tenantContext: TenantContext,
    private loadingService: GlobalLoadingService,
    private snackbar: SnackbarService
  ) {}

  get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http.get<T>(url, httpOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  post<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http.post<T>(url, data, httpOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  put<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http.put<T>(url, data, httpOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  patch<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http.patch<T>(url, data, httpOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  delete<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return this.http.delete<T>(url, httpOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // Cached GET request
  getCached<T>(endpoint: string, ttl: number = 300000, options?: ApiRequestOptions): Observable<T> {
    const cacheKey = this.getCacheKey(endpoint, options);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return of(cached.data);
    }

    return this.get<T>(endpoint, options).pipe(
      tap(data => {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl
        });
      }),
      shareReplay(1)
    );
  }

  // Paginated GET request
  getPaginated<T>(
    endpoint: string,
    page: number = 1,
    pageSize: number = 10,
    options?: ApiRequestOptions
  ): Observable<PaginatedResponse<T>> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...options?.params
    };

    return this.get<PaginatedResponse<T>>(endpoint, {
      ...options,
      params
    });
  }

  // Upload file
  uploadFile<T>(endpoint: string, file: File, additionalData?: any): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.post<T>(endpoint, formData, {
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      }
    });
  }

  // Download file
  downloadFile(endpoint: string, filename?: string): Observable<Blob> {
    return this.get<Blob>(endpoint, {
      responseType: 'blob'
    }).pipe(
      tap(blob => {
        if (filename) {
          this.saveBlobAsFile(blob, filename);
        }
      })
    );
  }

  // Clear cache
  clearCache(pattern?: string): void {
    if (pattern) {
      const regex = new RegExp(pattern);
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  private buildUrl(endpoint: string): string {
    const baseUrl = this.config.getApiUrl();
    const tenantId = this.tenantContext.getTenantId();
    
    // Add tenant context if in multi-tenant mode
    if (this.tenantContext.isMultiTenant && tenantId) {
      return `${baseUrl}/tenants/${tenantId}/${endpoint}`;
    }
    
    return `${baseUrl}/${endpoint}`;
  }

  private buildHttpOptions(options?: ApiRequestOptions): any {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    return {
      headers: { ...defaultHeaders, ...options?.headers },
      params: options?.params,
      responseType: options?.responseType || 'json',
      observe: options?.observe || 'body'
    };
  }

  private getCacheKey(endpoint: string, options?: ApiRequestOptions): string {
    const params = options?.params ? JSON.stringify(options.params) : '';
    return `${endpoint}${params}`;
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    
    // Don't show snackbar for certain errors (handled by interceptors)
    if (error.status !== 401 && error.status !== 403) {
      this.snackbar.error('An error occurred while processing your request.');
    }
    
    return throwError(() => error);
  }

  private saveBlobAsFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}