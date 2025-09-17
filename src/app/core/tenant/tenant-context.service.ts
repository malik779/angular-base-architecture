import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TenantInfo {
  id: string;
  name: string;
  domain?: string;
  theme?: {
    primary: string;
    secondary: string;
    logo?: string;
  };
  config?: {
    features: Record<string, boolean>;
    settings: Record<string, any>;
  };
  metadata?: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class TenantContext {
  private _tenant$ = new BehaviorSubject<TenantInfo | null>(null);
  private _isMultiTenant$ = new BehaviorSubject<boolean>(false);

  get tenant$(): Observable<TenantInfo | null> {
    return this._tenant$.asObservable();
  }

  get isMultiTenant$(): Observable<boolean> {
    return this._isMultiTenant$.asObservable();
  }

  get tenant(): TenantInfo | null {
    return this._tenant$.value;
  }

  get isMultiTenant(): boolean {
    return this._isMultiTenant$.value;
  }

  setTenant(tenant: TenantInfo): void {
    this._tenant$.next(tenant);
  }

  setMultiTenantMode(isMultiTenant: boolean): void {
    this._isMultiTenant$.next(isMultiTenant);
  }

  getTenantId(): string | null {
    return this._tenant$.value?.id ?? null;
  }

  getFeature(featureName: string): boolean {
    const tenant = this._tenant$.value;
    return tenant?.config?.features?.[featureName] ?? false;
  }

  getSetting(settingName: string): any {
    const tenant = this._tenant$.value;
    return tenant?.config?.settings?.[settingName];
  }

  clearTenant(): void {
    this._tenant$.next(null);
  }
}