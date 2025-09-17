import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { ModalService } from '../../core/ui/modal.service';

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-host" *ngIf="isOpen">
      <div class="modal-backdrop" (click)="close()"></div>
      <div class="modal-container" [class]="modalClass">
        <div class="modal-header" *ngIf="showHeader">
          <h3 class="modal-title">{{ title }}</h3>
          <button 
            *ngIf="showCloseButton"
            class="modal-close"
            (click)="close()"
            type="button">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        
        <div class="modal-footer" *ngIf="showFooter">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
    }

    .modal-container {
      position: relative;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
      animation: modalSlideIn 0.3s ease-out;
    }

    .modal-container.small {
      width: 400px;
    }

    .modal-container.medium {
      width: 600px;
    }

    .modal-container.large {
      width: 800px;
    }

    .modal-container.fullscreen {
      width: 95vw;
      height: 95vh;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #374151;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #6b7280;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .modal-close:hover {
      background: #f3f4f6;
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      max-height: calc(90vh - 120px);
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalHostComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'small' | 'medium' | 'large' | 'fullscreen' = 'medium';
  @Input() showHeader = true;
  @Input() showFooter = false;
  @Input() showCloseButton = true;
  @Input() closeOnBackdrop = true;

  @Output() closed = new EventEmitter<void>();

  modalClass = '';
  private destroy$ = new Subject<void>();

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalClass = `modal-container ${this.size}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(): void {
    if (this.closeOnBackdrop) {
      this.isOpen = false;
      this.closed.emit();
    }
  }
}