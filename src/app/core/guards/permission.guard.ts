import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';

import { AuthService } from '../auth/auth.service';

export const permissionGuard = (requiredPermissions: string[]): CanActivateFn => {
  return (route, state): Observable<boolean> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
      take(1),
      map(user => {
        if (!user) {
          router.navigate(['/auth/login'], { 
            queryParams: { returnUrl: state.url } 
          });
          return false;
        }

        const hasRequiredPermission = requiredPermissions.some(permission => 
          user.permissions.includes(permission)
        );

        if (!hasRequiredPermission) {
          router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      })
    );
  };
};