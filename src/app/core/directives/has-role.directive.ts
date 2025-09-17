import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[hasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy {
  @Input('hasRole') role!: string;
  @Input('hasRoleMode') mode: 'any' | 'all' = 'any';

  private destroy$ = new Subject<void>();
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.role) {
      this.viewContainer.clear();
      return;
    }

    const roles = Array.isArray(this.role) 
      ? this.role 
      : [this.role];

    this.authService.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      if (!user) {
        this.updateView(false);
        return;
      }

      let hasRole: boolean;
      
      if (this.mode === 'all') {
        hasRole = roles.every(r => user.roles.includes(r));
      } else {
        hasRole = roles.some(r => user.roles.includes(r));
      }

      this.updateView(hasRole);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(hasRole: boolean): void {
    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}