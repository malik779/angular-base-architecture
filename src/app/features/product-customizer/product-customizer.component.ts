import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

interface CustomizationArea {
  id: string;
  name: string;
  type: 'text' | 'color' | 'image' | 'logo' | 'design';
  svgPath: string;
  value?: any;
  constraints?: any;
}

interface Product {
  id: string;
  name: string;
  baseImageUrl: string;
  svgData?: string;
  customizationAreas: CustomizationArea[];
  availableColors: string[];
  availableFonts: string[];
  price: number;
  customizationPrice: number;
}

@Component({
  selector: 'app-product-customizer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSliderModule,
    MatSelectModule,
    MatInputModule,
    MatTabsModule,
    MatChipsModule
  ],
  template: `
    <div class="customizer-container">
      <div class="customizer-header">
        <h1>Product Customization Builder</h1>
        <p>Personalize your product with text, colors, logos, and designs</p>
      </div>

      <div class="customizer-content">
        <!-- Preview Panel -->
        <div class="preview-panel">
          <mat-card class="preview-card">
            <div class="preview-header">
              <h3>Live Preview</h3>
              <div class="preview-actions">
                <button mat-icon-button (click)="zoomIn()">
                  <mat-icon>zoom_in</mat-icon>
                </button>
                <button mat-icon-button (click)="zoomOut()">
                  <mat-icon>zoom_out</mat-icon>
                </button>
                <button mat-icon-button (click)="resetZoom()">
                  <mat-icon>refresh</mat-icon>
                </button>
              </div>
            </div>
            
            <div class="preview-canvas" #previewCanvas>
              <svg 
                [attr.width]="canvasWidth" 
                [attr.height]="canvasHeight"
                [attr.viewBox]="'0 0 ' + canvasWidth + ' ' + canvasHeight"
                class="product-svg">
                
                <!-- Base Product Image -->
                <image 
                  [attr.href]="product.baseImageUrl" 
                  [attr.width]="canvasWidth"
                  [attr.height]="canvasHeight"
                  preserveAspectRatio="xMidYMid meet" />
                
                <!-- Customization Layers -->
                <g *ngFor="let area of product.customizationAreas">
                  <!-- Text Customization -->
                  <text 
                    *ngIf="area.type === 'text' && area.value"
                    [attr.x]="area.constraints?.x || canvasWidth / 2"
                    [attr.y]="area.constraints?.y || canvasHeight / 2"
                    [attr.font-family]="selectedFont"
                    [attr.font-size]="fontSize"
                    [attr.fill]="selectedTextColor"
                    [attr.text-anchor]="'middle'"
                    [attr.dominant-baseline]="'middle'">
                    {{ area.value }}
                  </text>
                  
                  <!-- Color Customization -->
                  <path 
                    *ngIf="area.type === 'color'"
                    [attr.d]="area.svgPath"
                    [attr.fill]="area.value || selectedColor"
                    [attr.stroke]="'none'" />
                  
                  <!-- Logo/Image Customization -->
                  <image 
                    *ngIf="area.type === 'logo' && area.value"
                    [attr.href]="area.value"
                    [attr.x]="area.constraints?.x || 50"
                    [attr.y]="area.constraints?.y || 50"
                    [attr.width]="logoSize"
                    [attr.height]="logoSize"
                    preserveAspectRatio="xMidYMid meet" />
                </g>
              </svg>
            </div>

            <div class="preview-footer">
              <div class="price-info">
                <span class="base-price">Base: ${{ product.price }}</span>
                <span class="customization-price">+ Customization: ${{ product.customizationPrice }}</span>
                <span class="total-price">Total: ${{ product.price + product.customizationPrice }}</span>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Customization Panel -->
        <div class="customization-panel">
          <mat-card class="customization-card">
            <mat-tab-group>
              <!-- Text Customization -->
              <mat-tab label="Text">
                <div class="tab-content">
                  <h3>Add Custom Text</h3>
                  
                  <div *ngFor="let area of getAreasByType('text')" class="customization-section">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>{{ area.name }}</mat-label>
                      <input 
                        matInput 
                        [(ngModel)]="area.value"
                        [maxlength]="area.constraints?.maxLength || 50"
                        placeholder="Enter your text">
                      <mat-hint>{{ (area.value?.length || 0) }} / {{ area.constraints?.maxLength || 50 }}</mat-hint>
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Font</mat-label>
                    <mat-select [(ngModel)]="selectedFont">
                      <mat-option *ngFor="let font of product.availableFonts" [value]="font">
                        {{ font }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <div class="slider-control">
                    <label>Font Size: {{ fontSize }}px</label>
                    <mat-slider 
                      [min]="12" 
                      [max]="72" 
                      [step]="1"
                      [(ngModel)]="fontSize"
                      class="full-width">
                    </mat-slider>
                  </div>

                  <div class="color-picker">
                    <label>Text Color</label>
                    <div class="color-options">
                      <div 
                        *ngFor="let color of commonColors"
                        class="color-swatch"
                        [style.background-color]="color"
                        [class.selected]="selectedTextColor === color"
                        (click)="selectedTextColor = color">
                      </div>
                      <input 
                        type="color" 
                        [(ngModel)]="selectedTextColor"
                        class="color-input">
                    </div>
                  </div>
                </div>
              </mat-tab>

              <!-- Color Customization -->
              <mat-tab label="Colors">
                <div class="tab-content">
                  <h3>Choose Product Colors</h3>
                  
                  <div *ngFor="let area of getAreasByType('color')" class="customization-section">
                    <label>{{ area.name }}</label>
                    <div class="color-options">
                      <div 
                        *ngFor="let color of product.availableColors"
                        class="color-swatch large"
                        [style.background-color]="color"
                        [class.selected]="area.value === color"
                        (click)="area.value = color">
                        <mat-icon *ngIf="area.value === color">check</mat-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </mat-tab>

              <!-- Logo Upload -->
              <mat-tab label="Logo">
                <div class="tab-content">
                  <h3>Upload Your Logo</h3>
                  
                  <div *ngFor="let area of getAreasByType('logo')" class="customization-section">
                    <div class="upload-area" (click)="fileInput.click()">
                      <mat-icon *ngIf="!area.value">cloud_upload</mat-icon>
                      <img *ngIf="area.value" [src]="area.value" alt="Logo preview">
                      <p *ngIf="!area.value">Click to upload logo</p>
                      <p class="hint">Max size: 5MB • PNG, JPG, SVG</p>
                    </div>
                    <input 
                      #fileInput
                      type="file" 
                      accept="image/*"
                      (change)="onLogoUpload($event, area)"
                      style="display: none">
                  </div>

                  <div class="slider-control" *ngIf="getAreasByType('logo').length > 0">
                    <label>Logo Size: {{ logoSize }}px</label>
                    <mat-slider 
                      [min]="50" 
                      [max]="300" 
                      [step]="10"
                      [(ngModel)]="logoSize"
                      class="full-width">
                    </mat-slider>
                  </div>
                </div>
              </mat-tab>

              <!-- Design Selection -->
              <mat-tab label="Designs">
                <div class="tab-content">
                  <h3>Choose a Design</h3>
                  
                  <div class="design-grid">
                    <div 
                      *ngFor="let design of availableDesigns"
                      class="design-option"
                      [class.selected]="selectedDesign === design.id"
                      (click)="selectDesign(design)">
                      <img [src]="design.thumbnailUrl" [alt]="design.name">
                      <p>{{ design.name }}</p>
                    </div>
                  </div>
                </div>
              </mat-tab>
            </mat-tab-group>

            <div class="action-buttons">
              <button mat-raised-button (click)="resetCustomization()">
                <mat-icon>refresh</mat-icon>
                Reset
              </button>
              <button mat-raised-button (click)="saveCustomization()">
                <mat-icon>save</mat-icon>
                Save
              </button>
              <button mat-raised-button color="primary" (click)="addToCart()">
                <mat-icon>shopping_cart</mat-icon>
                Add to Cart
              </button>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customizer-container {
      padding: 2rem;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .customizer-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .customizer-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .customizer-header p {
      font-size: 1.1rem;
      color: #666;
    }

    .customizer-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      max-width: 1600px;
      margin: 0 auto;
    }

    .preview-panel,
    .customization-panel {
      height: fit-content;
    }

    .preview-card,
    .customization-card {
      padding: 1.5rem;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .preview-header h3 {
      margin: 0;
      font-size: 1.3rem;
      color: #333;
    }

    .preview-actions {
      display: flex;
      gap: 0.5rem;
    }

    .preview-canvas {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 500px;
      overflow: auto;
    }

    .product-svg {
      max-width: 100%;
      height: auto;
    }

    .preview-footer {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 2px solid #e0e0e0;
    }

    .price-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .price-info span {
      font-size: 1rem;
    }

    .total-price {
      font-size: 1.5rem !important;
      font-weight: 700;
      color: #667eea;
    }

    .tab-content {
      padding: 1.5rem 0;
    }

    .tab-content h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .customization-section {
      margin-bottom: 2rem;
    }

    .full-width {
      width: 100%;
    }

    .slider-control {
      margin-bottom: 1.5rem;
    }

    .slider-control label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }

    .color-picker label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }

    .color-options {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .color-swatch {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      border: 3px solid transparent;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .color-swatch.large {
      width: 60px;
      height: 60px;
    }

    .color-swatch.selected {
      border-color: #667eea;
      transform: scale(1.1);
    }

    .color-swatch mat-icon {
      color: white;
      font-size: 1.5rem;
    }

    .color-input {
      width: 60px;
      height: 40px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .upload-area {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 3rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    }

    .upload-area:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .upload-area mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #999;
    }

    .upload-area img {
      max-width: 200px;
      max-height: 200px;
    }

    .upload-area p {
      margin: 1rem 0 0;
      color: #666;
    }

    .upload-area .hint {
      font-size: 0.85rem;
      color: #999;
    }

    .design-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }

    .design-option {
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s;
      text-align: center;
    }

    .design-option:hover {
      border-color: #667eea;
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .design-option.selected {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .design-option img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }

    .design-option p {
      margin: 0;
      font-size: 0.9rem;
      color: #555;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid #e0e0e0;
    }

    .action-buttons button {
      flex: 1;
    }

    @media (max-width: 1200px) {
      .customizer-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductCustomizerComponent implements OnInit {
  @ViewChild('previewCanvas') previewCanvas!: ElementRef;

  product: Product = {
    id: '1',
    name: 'Custom T-Shirt',
    baseImageUrl: 'assets/images/tshirt-template.png',
    customizationAreas: [
      {
        id: '1',
        name: 'Front Text',
        type: 'text',
        svgPath: '',
        constraints: { x: 250, y: 200, maxLength: 30 }
      },
      {
        id: '2',
        name: 'T-Shirt Color',
        type: 'color',
        svgPath: 'M100,50 L400,50 L400,450 L100,450 Z',
        value: '#FFFFFF'
      },
      {
        id: '3',
        name: 'Logo Placement',
        type: 'logo',
        svgPath: '',
        constraints: { x: 200, y: 100 }
      }
    ],
    availableColors: ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'],
    availableFonts: ['Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana', 'Georgia', 'Comic Sans MS'],
    price: 29.99,
    customizationPrice: 5.00
  };

  canvasWidth = 500;
  canvasHeight = 600;
  zoomLevel = 1;

  selectedFont = 'Arial';
  fontSize = 24;
  selectedTextColor = '#000000';
  selectedColor = '#FFFFFF';
  logoSize = 100;
  selectedDesign: string | null = null;

  commonColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  availableDesigns = [
    { id: '1', name: 'Classic', thumbnailUrl: 'assets/designs/classic.png' },
    { id: '2', name: 'Modern', thumbnailUrl: 'assets/designs/modern.png' },
    { id: '3', name: 'Vintage', thumbnailUrl: 'assets/designs/vintage.png' },
    { id: '4', name: 'Minimalist', thumbnailUrl: 'assets/designs/minimalist.png' }
  ];

  ngOnInit(): void {
    // Initialize customizer
  }

  getAreasByType(type: string): CustomizationArea[] {
    return this.product.customizationAreas.filter(area => area.type === type);
  }

  onLogoUpload(event: any, area: CustomizationArea): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        area.value = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  selectDesign(design: any): void {
    this.selectedDesign = design.id;
    // Apply design to product
  }

  zoomIn(): void {
    this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
    this.updateCanvasSize();
  }

  zoomOut(): void {
    this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
    this.updateCanvasSize();
  }

  resetZoom(): void {
    this.zoomLevel = 1;
    this.updateCanvasSize();
  }

  updateCanvasSize(): void {
    this.canvasWidth = 500 * this.zoomLevel;
    this.canvasHeight = 600 * this.zoomLevel;
  }

  resetCustomization(): void {
    this.product.customizationAreas.forEach(area => {
      area.value = undefined;
    });
    this.selectedFont = 'Arial';
    this.fontSize = 24;
    this.selectedTextColor = '#000000';
    this.logoSize = 100;
    this.selectedDesign = null;
  }

  saveCustomization(): void {
    const customization = {
      productId: this.product.id,
      areas: this.product.customizationAreas.map(area => ({
        id: area.id,
        type: area.type,
        value: area.value
      })),
      font: this.selectedFont,
      fontSize: this.fontSize,
      textColor: this.selectedTextColor,
      logoSize: this.logoSize,
      design: this.selectedDesign
    };
    
    console.log('Saving customization:', customization);
    // Save to backend
  }

  addToCart(): void {
    this.saveCustomization();
    console.log('Adding customized product to cart');
    // Add to cart logic
  }
}
