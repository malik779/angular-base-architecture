import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule
  ],
  template: `
    <div class="search-input-container">
      <div class="search-input-wrapper">
        <input
          pInputText
          [formControl]="searchControl"
          [placeholder]="placeholder"
          [disabled]="disabled"
          class="search-input"
          [class.has-value]="searchControl.value">
        
        <button
          *ngIf="showClear && searchControl.value"
          pButton
          type="button"
          icon="pi pi-times"
          class="p-button-text p-button-sm clear-button"
          (click)="clearSearch()"
          pTooltip="Clear search">
        </button>
        
        <button
          *ngIf="showSearchIcon"
          pButton
          type="button"
          icon="pi pi-search"
          class="p-button-text p-button-sm search-icon"
          [disabled]="true">
        </button>
      </div>
      
      <div *ngIf="showSuggestions && suggestions.length > 0" class="suggestions">
        <div
          *ngFor="let suggestion of suggestions"
          class="suggestion-item"
          (click)="selectSuggestion(suggestion)">
          {{ suggestion }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-input-container {
      position: relative;
      width: 100%;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 100%;
      padding-right: 2.5rem;
    }

    .search-input.has-value {
      padding-right: 5rem;
    }

    .clear-button {
      position: absolute;
      right: 2.5rem;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
    }

    .search-icon {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      opacity: 0.5;
    }

    .suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 4px 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;
    }

    .suggestion-item {
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-bottom: 1px solid #f3f4f6;
      transition: background-color 0.2s;
    }

    .suggestion-item:hover {
      background: #f8f9fa;
    }

    .suggestion-item:last-child {
      border-bottom: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchInputComponent implements OnInit, OnDestroy {
  @Input() placeholder = 'Search...';
  @Input() debounceTime = 300;
  @Input() disabled = false;
  @Input() showClear = true;
  @Input() showSearchIcon = true;
  @Input() showSuggestions = false;
  @Input() suggestions: string[] = [];

  @Output() valueChange = new EventEmitter<string>();
  @Output() suggestionSelected = new EventEmitter<string>();

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.valueChange.emit(value || '');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  selectSuggestion(suggestion: string): void {
    this.searchControl.setValue(suggestion);
    this.suggestionSelected.emit(suggestion);
  }

  setValue(value: string): void {
    this.searchControl.setValue(value);
  }

  getValue(): string {
    return this.searchControl.value || '';
  }
}