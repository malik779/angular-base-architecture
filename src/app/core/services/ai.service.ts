import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';

export interface ProductSeoContent {
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  metaDescription?: string;
}

export interface ProductInsights {
  performanceScore: string;
  recommendedAction: string;
  detailedInsights: string;
  actionItems: string[];
  isSlowMoving: boolean;
  daysUntilStockout?: number;
}

export interface PricingRecommendation {
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  reasoning: string;
  expectedImpact: number;
}

export interface DemandForecast {
  predictedSales: number;
  confidence: number;
  trend: string;
  dailyForecasts: Array<{ date: string; predictedUnits: number }>;
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ) {
    this.apiUrl = this.config.get('apiBaseUrl') + '/ai';
  }

  generateSeoContent(productData: any): Observable<ProductSeoContent> {
    return this.http.post<ProductSeoContent>(`${this.apiUrl}/seo/generate`, productData);
  }

  generateProductDescription(productData: any): Observable<{ description: string }> {
    return this.http.post<{ description: string }>(`${this.apiUrl}/description/generate`, productData);
  }

  analyzeProductImage(imageUrl: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/image/analyze`, { imageUrl });
  }

  getProductInsights(productId: string): Observable<ProductInsights> {
    return this.http.get<ProductInsights>(`${this.apiUrl}/insights/${productId}`);
  }

  getPricingRecommendation(productId: string): Observable<PricingRecommendation> {
    return this.http.get<PricingRecommendation>(`${this.apiUrl}/pricing/${productId}`);
  }

  getDemandForecast(productId: string, days: number = 30): Observable<DemandForecast> {
    return this.http.get<DemandForecast>(`${this.apiUrl}/forecast/${productId}?days=${days}`);
  }

  getSlowMovingProducts(tenantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/slow-moving/${tenantId}`);
  }

  optimizeAllProducts(tenantId: string): Observable<{ optimized: number }> {
    return this.http.post<{ optimized: number }>(`${this.apiUrl}/optimize-all/${tenantId}`, {});
  }
}
