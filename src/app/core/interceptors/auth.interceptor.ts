import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { TokenStoreService } from '../auth/token-store.service';
import { AuthService } from '../auth/auth.service';
import { GlobalLoadingService } from '../ui/global-loading.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> => {
  const tokenStore = inject(TokenStoreService);
  const authService = inject(AuthService);
  const loadingService = inject(GlobalLoadingService);

  // Skip auth for login and public endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh') || req.url.includes('/public/')) {
    return next(req);
  }

  const token = tokenStore.getAccessToken();
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: tokenStore.getAuthorizationHeader() || ''
      }
    });
    return next(authReq);
  }

  return next(req);
};

export const refreshTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> => {
  const tokenStore = inject(TokenStoreService);
  const authService = inject(AuthService);

  // Skip refresh for login and refresh endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && tokenStore.getRefreshToken()) {
        return from(authService.refreshToken()).pipe(
          switchMap((newToken) => {
            if (newToken) {
              const authReq = req.clone({
                setHeaders: {
                  Authorization: tokenStore.getAuthorizationHeader() || ''
                }
              });
              return next(authReq);
            } else {
              authService.logout();
              return throwError(() => error);
            }
          })
        );
      }
      return throwError(() => error);
    })
  );
};