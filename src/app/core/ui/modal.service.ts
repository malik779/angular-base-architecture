import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly defaultConfig: MatDialogConfig = {
    width: '720px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    disableClose: false,
    autoFocus: true,
    restoreFocus: true,
    panelClass: 'custom-dialog-container'
  };

  constructor(private dialog: MatDialog) {}

  open<T, R = any>(
    component: Type<T>,
    config?: Partial<MatDialogConfig>
  ): MatDialogRef<T, R> {
    const finalConfig = { ...this.defaultConfig, ...config };
    return this.dialog.open(component, finalConfig);
  }

  openSmall<T, R = any>(
    component: Type<T>,
    config?: Partial<MatDialogConfig>
  ): MatDialogRef<T, R> {
    return this.open(component, {
      ...config,
      width: '400px',
      maxWidth: '95vw'
    });
  }

  openLarge<T, R = any>(
    component: Type<T>,
    config?: Partial<MatDialogConfig>
  ): MatDialogRef<T, R> {
    return this.open(component, {
      ...config,
      width: '1200px',
      maxWidth: '95vw'
    });
  }

  openFullscreen<T, R = any>(
    component: Type<T>,
    config?: Partial<MatDialogConfig>
  ): MatDialogRef<T, R> {
    return this.open(component, {
      ...config,
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh'
    });
  }

  closeAll(): void {
    this.dialog.closeAll();
  }

  getDialogById(id: string): MatDialogRef<any> | undefined {
    return this.dialog.getDialogById(id);
  }
}