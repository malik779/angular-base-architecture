import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private memoryCache = new Map<string, CacheItem>();
  private readonly defaultOptions: Required<CacheOptions> = {
    ttl: 300000, // 5 minutes
    maxSize: 100,
    storage: 'memory'
  };

  constructor() {
    // Clean up expired items every minute
    setInterval(() => {
      this.cleanupExpiredItems();
    }, 60000);
  }

  set<T>(key: string, data: T, options?: Partial<CacheOptions>): void {
    const opts = { ...this.defaultOptions, ...options };
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: opts.ttl,
      key
    };

    switch (opts.storage) {
      case 'localStorage':
        this.setLocalStorage(key, item);
        break;
      case 'sessionStorage':
        this.setSessionStorage(key, item);
        break;
      default:
        this.setMemory(key, item, opts.maxSize);
    }
  }

  get<T>(key: string, options?: Partial<CacheOptions>): T | null {
    const opts = { ...this.defaultOptions, ...options };
    let item: CacheItem<T> | null = null;

    switch (opts.storage) {
      case 'localStorage':
        item = this.getLocalStorage<T>(key);
        break;
      case 'sessionStorage':
        item = this.getSessionStorage<T>(key);
        break;
      default:
        item = this.getMemory<T>(key);
    }

    if (!item) {
      return null;
    }

    // Check if item is expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key, options);
      return null;
    }

    return item.data;
  }

  delete(key: string, options?: Partial<CacheOptions>): void {
    const opts = { ...this.defaultOptions, ...options };

    switch (opts.storage) {
      case 'localStorage':
        localStorage.removeItem(this.getStorageKey(key));
        break;
      case 'sessionStorage':
        sessionStorage.removeItem(this.getStorageKey(key));
        break;
      default:
        this.memoryCache.delete(key);
    }
  }

  clear(options?: Partial<CacheOptions>): void {
    const opts = { ...this.defaultOptions, ...options };

    switch (opts.storage) {
      case 'localStorage':
        this.clearLocalStorage();
        break;
      case 'sessionStorage':
        this.clearSessionStorage();
        break;
      default:
        this.memoryCache.clear();
    }
  }

  has(key: string, options?: Partial<CacheOptions>): boolean {
    return this.get(key, options) !== null;
  }

  // Observable-based caching
  cacheObservable<T>(
    key: string,
    observable: Observable<T>,
    options?: Partial<CacheOptions>
  ): Observable<T> {
    const cached = this.get<T>(key, options);
    
    if (cached !== null) {
      return of(cached);
    }

    return observable.pipe(
      tap(data => this.set(key, data, options)),
      shareReplay(1)
    );
  }

  // Pattern-based cache clearing
  clearPattern(pattern: string, options?: Partial<CacheOptions>): void {
    const opts = { ...this.defaultOptions, ...options };
    const regex = new RegExp(pattern);

    switch (opts.storage) {
      case 'localStorage':
        this.clearLocalStoragePattern(regex);
        break;
      case 'sessionStorage':
        this.clearSessionStoragePattern(regex);
        break;
      default:
        for (const key of this.memoryCache.keys()) {
          if (regex.test(key)) {
            this.memoryCache.delete(key);
          }
        }
    }
  }

  // Get cache statistics
  getStats(options?: Partial<CacheOptions>): { size: number; hitRate: number } {
    const opts = { ...this.defaultOptions, ...options };
    let size = 0;

    switch (opts.storage) {
      case 'localStorage':
        size = this.getLocalStorageSize();
        break;
      case 'sessionStorage':
        size = this.getSessionStorageSize();
        break;
      default:
        size = this.memoryCache.size;
    }

    return {
      size,
      hitRate: 0 // TODO: Implement hit rate tracking
    };
  }

  private setMemory<T>(key: string, item: CacheItem<T>, maxSize: number): void {
    // Remove oldest items if cache is full
    if (this.memoryCache.size >= maxSize) {
      const oldestKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(oldestKey);
    }
    
    this.memoryCache.set(key, item);
  }

  private getMemory<T>(key: string): CacheItem<T> | null {
    return this.memoryCache.get(key) || null;
  }

  private setLocalStorage<T>(key: string, item: CacheItem<T>): void {
    try {
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set localStorage cache:', error);
    }
  }

  private getLocalStorage<T>(key: string): CacheItem<T> | null {
    try {
      const item = localStorage.getItem(this.getStorageKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to get localStorage cache:', error);
      return null;
    }
  }

  private setSessionStorage<T>(key: string, item: CacheItem<T>): void {
    try {
      sessionStorage.setItem(this.getStorageKey(key), JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set sessionStorage cache:', error);
    }
  }

  private getSessionStorage<T>(key: string): CacheItem<T> | null {
    try {
      const item = sessionStorage.getItem(this.getStorageKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to get sessionStorage cache:', error);
      return null;
    }
  }

  private clearLocalStorage(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }

  private clearSessionStorage(): void {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        sessionStorage.removeItem(key);
      }
    });
  }

  private clearLocalStoragePattern(regex: RegExp): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_') && regex.test(key)) {
        localStorage.removeItem(key);
      }
    });
  }

  private clearSessionStoragePattern(regex: RegExp): void {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_') && regex.test(key)) {
        sessionStorage.removeItem(key);
      }
    });
  }

  private getLocalStorageSize(): number {
    return Object.keys(localStorage).filter(key => key.startsWith('cache_')).length;
  }

  private getSessionStorageSize(): number {
    return Object.keys(sessionStorage).filter(key => key.startsWith('cache_')).length;
  }

  private getStorageKey(key: string): string {
    return `cache_${key}`;
  }

  private cleanupExpiredItems(): void {
    const now = Date.now();
    
    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.memoryCache.delete(key);
      }
    }
  }
}