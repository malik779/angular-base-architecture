import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Landing Page (Public)
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  
  // Authentication
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  
  // Dashboard (Protected)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  
  // Products Management
  {
    path: 'products',
    canActivate: [authGuard],
    loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule)
  },
  
  // Product Customizer
  {
    path: 'products/:id/customize',
    loadComponent: () => import('./features/product-customizer/product-customizer.component').then(m => m.ProductCustomizerComponent)
  },
  
  // Orders Management
  {
    path: 'orders',
    canActivate: [authGuard],
    loadChildren: () => import('./features/orders/orders.module').then(m => m.OrdersModule)
  },
  
  // AI Dashboard
  {
    path: 'ai-dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/ai-dashboard/ai-dashboard.component').then(m => m.AIDashboardComponent)
  },
  
  // Social Media Management
  {
    path: 'social-media',
    canActivate: [authGuard],
    loadComponent: () => import('./features/social-media/social-media.component').then(m => m.SocialMediaComponent)
  },
  
  // Theme Management
  {
    path: 'theme',
    canActivate: [authGuard],
    loadComponent: () => import('./features/theme-manager/theme-manager.component').then(m => m.ThemeManagerComponent)
  },
  
  // Admin Panel
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
  
  // Super Admin Panel
  {
    path: 'superadmin',
    canActivate: [authGuard, roleGuard(['superadmin'])],
    loadComponent: () => import('./features/superadmin/superadmin.component').then(m => m.SuperAdminComponent)
  },
  
  // Subscription Management
  {
    path: 'subscription',
    canActivate: [authGuard],
    loadComponent: () => import('./features/subscription/subscription.component').then(m => m.SubscriptionComponent)
  },
  
  // Settings
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
  },
  
  // Error Pages
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent)
  },
  {
    path: '404',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(c => c.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
