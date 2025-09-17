import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SnackbarService } from '../ui/snackbar.service';
import { GlobalLoadingService } from '../ui/global-loading.service';
import { AuthService } from '../auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(SnackbarService);
  const loadingService = inject(GlobalLoadingService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Hide loading on error
      loadingService.hide();

      // Handle different error types
      switch (error.status) {
        case 400:
          snackbar.error('Bad request. Please check your input.');
          break;
        case 401:
          // Don't show error for 401 - auth interceptor will handle refresh
          if (!req.url.includes('/auth/refresh')) {
            snackbar.error('Session expired. Please log in again.');
            authService.logout();
          }
          break;
        case 403:
          snackbar.error('Access denied. You don\'t have permission to perform this action.');
          break;
        case 404:
          snackbar.error('Resource not found.');
          break;
        case 409:
          snackbar.error('Conflict. The resource already exists or has been modified.');
          break;
        case 422:
          snackbar.error('Validation failed. Please check your input.');
          break;
        case 429:
          snackbar.error('Too many requests. Please try again later.');
          break;
        case 500:
          snackbar.error('Server error. Please try again later.');
          break;
        case 502:
        case 503:
        case 504:
          snackbar.error('Service temporarily unavailable. Please try again later.');
          break;
        default:
          if (error.status >= 400) {
            snackbar.error('An unexpected error occurred. Please try again.');
          }
      }

      return throwError(() => error);
    })
  );
};