import { Injectable, ComponentRef, ViewContainerRef, TemplateRef, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  showSpinner?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalLoadingService {
  private _loadingState$ = new BehaviorSubject<LoadingState>({
    isLoading: false,
    message: 'Loading...',
    showSpinner: true
  });

  private _loadingCount = 0;
  private _loadingOverlayRef: ComponentRef<any> | null = null;

  get loadingState$(): Observable<LoadingState> {
    return this._loadingState$.asObservable();
  }

  get isLoading(): boolean {
    return this._loadingState$.value.isLoading;
  }

  show(message?: string, showSpinner: boolean = true): void {
    this._loadingCount++;
    
    if (this._loadingCount === 1) {
      this._loadingState$.next({
        isLoading: true,
        message: message || 'Loading...',
        showSpinner
      });
    }
  }

  hide(): void {
    this._loadingCount = Math.max(0, this._loadingCount - 1);
    
    if (this._loadingCount === 0) {
      this._loadingState$.next({
        isLoading: false,
        message: 'Loading...',
        showSpinner: true
      });
    }
  }

  setLoading(isLoading: boolean, message?: string): void {
    if (isLoading) {
      this.show(message);
    } else {
      this.hide();
    }
  }

  reset(): void {
    this._loadingCount = 0;
    this._loadingState$.next({
      isLoading: false,
      message: 'Loading...',
      showSpinner: true
    });
  }

  // For async operations
  async withLoading<T>(
    operation: () => Promise<T>,
    message?: string
  ): Promise<T> {
    this.show(message);
    try {
      const result = await operation();
      return result;
    } finally {
      this.hide();
    }
  }

  // For observables
  withLoadingObservable<T>(
    operation: () => Observable<T>,
    message?: string
  ): Observable<T> {
    this.show(message);
    return operation().pipe(
      tap({
        next: () => this.hide(),
        error: () => this.hide(),
        complete: () => this.hide()
      })
    );
  }
}