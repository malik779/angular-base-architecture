import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  @Input('hasPermission') permission!: string;
  @Input('hasPermissionMode') mode: 'any' | 'all' = 'any';

  private destroy$ = new Subject<void>();
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.permission) {
      this.viewContainer.clear();
      return;
    }

    const permissions = Array.isArray(this.permission) 
      ? this.permission 
      : [this.permission];

    this.authService.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      if (!user) {
        this.updateView(false);
        return;
      }

      let hasPermission: boolean;
      
      if (this.mode === 'all') {
        hasPermission = permissions.every(p => user.permissions.includes(p));
      } else {
        hasPermission = permissions.some(p => user.permissions.includes(p));
      }

      this.updateView(hasPermission);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(hasPermission: boolean): void {
    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}