import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface AppConfig {
  apiBaseUrl: string;
  identityServerUrl: string;
  clientId: string;
  tenantMode: boolean;
  features: Record<string, boolean>;
  theme: {
    primary: string;
    secondary: string;
  };
  version: string;
  environment: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private _config: AppConfig | null = null;
  private _config$ = new BehaviorSubject<AppConfig | null>(null);
  private _isLoaded = false;

  constructor(private http: HttpClient) {}

  get config$(): Observable<AppConfig | null> {
    return this._config$.asObservable();
  }

  get config(): AppConfig | null {
    return this._config;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  load(): Promise<void> {
    if (this._isLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.http.get<AppConfig>('/assets/runtime-config.json')
        .pipe(
          catchError(() => {
            // Fallback to default config if file doesn't exist
            const defaultConfig: AppConfig = {
              apiBaseUrl: 'http://localhost:3000/api',
              identityServerUrl: 'http://localhost:5000',
              clientId: 'angular-app',
              tenantMode: false,
              features: {
                orders: true,
                products: true,
                admin: false
              },
              theme: {
                primary: '#3f51b5',
                secondary: '#ff4081'
              },
              version: '1.0.0',
              environment: 'development'
            };
            return of(defaultConfig);
          }),
          tap(config => {
            this._config = config;
            this._config$.next(config);
            this._isLoaded = true;
          })
        )
        .subscribe({
          next: () => resolve(),
          error: (error) => {
            console.error('Failed to load app config:', error);
            reject(error);
          }
        });
    });
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] | undefined {
    return this._config?.[key];
  }

  getFeature(featureName: string): boolean {
    return this._config?.features?.[featureName] ?? false;
  }

  getApiUrl(endpoint: string = ''): string {
    const baseUrl = this._config?.apiBaseUrl ?? 'http://localhost:3000/api';
    return endpoint ? `${baseUrl}/${endpoint}` : baseUrl;
  }

  getIdentityUrl(endpoint: string = ''): string {
    const baseUrl = this._config?.identityServerUrl ?? 'http://localhost:5000';
    return endpoint ? `${baseUrl}/${endpoint}` : baseUrl;
  }
}