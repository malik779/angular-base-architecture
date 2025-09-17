import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type SnackbarType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: []
  };

  constructor(private snackBar: MatSnackBar) {}

  show(message: string, type: SnackbarType = 'info', config?: Partial<MatSnackBarConfig>): void {
    const finalConfig = {
      ...this.defaultConfig,
      ...config,
      panelClass: [...(this.defaultConfig.panelClass || []), `snackbar-${type}`]
    };

    this.snackBar.open(message, 'Close', finalConfig);
  }

  success(message: string, config?: Partial<MatSnackBarConfig>): void {
    this.show(message, 'success', { ...config, duration: 3000 });
  }

  error(message: string, config?: Partial<MatSnackBarConfig>): void {
    this.show(message, 'error', { ...config, duration: 6000 });
  }

  warning(message: string, config?: Partial<MatSnackBarConfig>): void {
    this.show(message, 'warning', { ...config, duration: 4000 });
  }

  info(message: string, config?: Partial<MatSnackBarConfig>): void {
    this.show(message, 'info', config);
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }
}