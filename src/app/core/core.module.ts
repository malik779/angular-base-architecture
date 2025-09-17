import { NgModule, APP_INITIALIZER, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { AppConfigService } from './config/app-config.service';
import { TenantInitializerService } from './tenant/tenant-initializer.service';
import { AuthService } from './auth/auth.service';
import { TokenStoreService } from './auth/token-store.service';
import { GlobalLoadingService } from './ui/global-loading.service';
import { SnackbarService } from './ui/snackbar.service';
import { ModalService } from './ui/modal.service';

// APP_INITIALIZER factory
export function initializeApp(
  configService: AppConfigService,
  tenantInitializer: TenantInitializerService,
  authService: AuthService
): () => Promise<void> {
  return async () => {
    try {
      // Load runtime configuration first
      await configService.load();
      
      // Initialize tenant context
      await tenantInitializer.initialize();
      
      // Initialize authentication
      await authService.initialize();
    } catch (error) {
      console.error('App initialization failed:', error);
      throw error;
    }
  };
}

const APP_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: initializeApp,
  deps: [AppConfigService, TenantInitializerService, AuthService],
  multi: true
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [
    // Core services
    AppConfigService,
    TenantInitializerService,
    AuthService,
    TokenStoreService,
    GlobalLoadingService,
    SnackbarService,
    ModalService,
    
    // APP_INITIALIZER
    APP_INITIALIZER_PROVIDER
  ]
})
export class CoreModule {
  constructor() {
    // Prevent CoreModule from being imported multiple times
    if (CoreModule._instance) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only.');
    }
    CoreModule._instance = true;
  }
  
  private static _instance = false;
}