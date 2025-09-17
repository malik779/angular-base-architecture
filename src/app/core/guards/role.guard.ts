import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';

import { AuthService } from '../auth/auth.service';

export const roleGuard = (requiredRoles: string[]): CanActivateFn => {
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

        const hasRequiredRole = requiredRoles.some(role => 
          user.roles.includes(role)
        );

        if (!hasRequiredRole) {
          router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      })
    );
  };
};