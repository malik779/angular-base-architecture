import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';

import { TokenStoreService, TokenData } from './token-store.service';
import { AppConfigService } from '../config/app-config.service';
import { GlobalLoadingService } from '../ui/global-loading.service';
import { SnackbarService } from '../ui/snackbar.service';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  tenantId?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  tenantId?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user$ = new BehaviorSubject<User | null>(null);
  private _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private _isInitialized$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private tokenStore: TokenStoreService,
    private config: AppConfigService,
    private loadingService: GlobalLoadingService,
    private snackbar: SnackbarService
  ) {}

  get user$(): Observable<User | null> {
    return this._user$.asObservable();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated$.asObservable();
  }

  get isInitialized$(): Observable<boolean> {
    return this._isInitialized$.asObservable();
  }

  get currentUser(): User | null {
    return this._user$.value;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated$.value;
  }

  async initialize(): Promise<void> {
    try {
      // Check if we have a valid token
      if (this.tokenStore.hasValidToken()) {
        await this.loadUserProfile();
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      this.logout();
    } finally {
      this._isInitialized$.next(true);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.config.getIdentityUrl()}/auth/login`,
      credentials
    ).pipe(
      tap(response => {
        this.tokenStore.setTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiresAt: Date.now() + (response.expiresIn * 1000),
          tokenType: response.tokenType
        });
        
        this._user$.next(response.user);
        this._isAuthenticated$.next(true);
      }),
      catchError(error => {
        this.snackbar.error('Login failed. Please check your credentials.');
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.tokenStore.clearTokens();
    this._user$.next(null);
    this._isAuthenticated$.next(false);
    
    // Optionally call logout endpoint
    this.http.post(`${this.config.getIdentityUrl()}/auth/logout`, {}).subscribe();
  }

  refreshToken(): Promise<string | null> {
    const refreshToken = this.tokenStore.getRefreshToken();
    
    if (!refreshToken) {
      this.logout();
      return Promise.resolve(null);
    }

    return this.http.post<{ accessToken: string; expiresIn: number }>(
      `${this.config.getIdentityUrl()}/auth/refresh`,
      { refreshToken }
    ).pipe(
      map(response => {
        this.tokenStore.setTokens({
          accessToken: response.accessToken,
          refreshToken: refreshToken,
          expiresAt: Date.now() + (response.expiresIn * 1000)
        });
        return response.accessToken;
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    ).toPromise() as Promise<string | null>;
  }

  private loadUserProfile(): Promise<void> {
    return this.http.get<User>(`${this.config.getApiUrl()}/auth/me`)
      .pipe(
        tap(user => {
          this._user$.next(user);
          this._isAuthenticated$.next(true);
        }),
        catchError(error => {
          console.error('Failed to load user profile:', error);
          this.logout();
          return throwError(() => error);
        })
      ).toPromise() as Promise<void>;
  }

  hasRole(role: string): boolean {
    const user = this.currentUser;
    return user?.roles?.includes(role) ?? false;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser;
    return user?.permissions?.includes(permission) ?? false;
  }

  hasRole$(role: string): Observable<boolean> {
    return this.user$.pipe(
      map(user => user?.roles?.includes(role) ?? false)
    );
  }

  hasPermission$(permission: string): Observable<boolean> {
    return this.user$.pipe(
      map(user => user?.permissions?.includes(permission) ?? false)
    );
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUser;
    return roles.some(role => user?.roles?.includes(role)) ?? false;
  }

  hasAnyPermission(permissions: string[]): boolean {
    const user = this.currentUser;
    return permissions.some(permission => user?.permissions?.includes(permission)) ?? false;
  }

  hasAllRoles(roles: string[]): boolean {
    const user = this.currentUser;
    return roles.every(role => user?.roles?.includes(role)) ?? false;
  }

  hasAllPermissions(permissions: string[]): boolean {
    const user = this.currentUser;
    return permissions.every(permission => user?.permissions?.includes(permission)) ?? false;
  }
}