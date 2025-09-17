import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { GlobalLoadingService } from '../ui/global-loading.service';

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> => {
  const loadingService = inject(GlobalLoadingService);

  // Skip loading for certain endpoints
  const skipLoadingEndpoints = [
    '/auth/refresh',
    '/heartbeat',
    '/ping'
  ];

  const shouldSkipLoading = skipLoadingEndpoints.some(endpoint => 
    req.url.includes(endpoint)
  );

  if (!shouldSkipLoading) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!shouldSkipLoading) {
        loadingService.hide();
      }
    })
  );
};