import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface ProductInsight {
  id: string;
  name: string;
  performanceScore: string;
  recommendedAction: string;
  insights: string;
  salesTrend: 'up' | 'down' | 'stable';
  conversionRate: number;
  revenue: number;
  stockLevel: number;
  daysSinceLastSale: number;
}

interface SalesForec ast {
  date: string;
  predicted: number;
  actual?: number;
}

@Component({
  selector: 'app-ai-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatTableModule,
    MatProgressBarModule
  ],
  template: `
    <div class="ai-dashboard">
      <div class="dashboard-header">
        <h1>AI Intelligence Dashboard</h1>
        <p>AI-powered insights to optimize your e-commerce business</p>
      </div>

      <!-- Key Metrics -->
      <div class="metrics-grid">
        <mat-card class="metric-card">
          <div class="metric-icon ai-icon">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="metric-content">
            <h3>AI Optimization Score</h3>
            <div class="metric-value">{{ aiScore }}<span class="metric-unit">/100</span></div>
            <p class="metric-change positive">+12% from last month</p>
          </div>
        </mat-card>

        <mat-card class="metric-card">
          <div class="metric-icon revenue-icon">
            <mat-icon>attach_money</mat-icon>
          </div>
          <div class="metric-content">
            <h3>Predicted Revenue</h3>
            <div class="metric-value">${{ predictedRevenue.toLocaleString() }}</div>
            <p class="metric-change positive">Next 30 days</p>
          </div>
        </mat-card>

        <mat-card class="metric-card">
          <div class="metric-icon warning-icon">
            <mat-icon>warning</mat-icon>
          </div>
          <div class="metric-content">
            <h3>Products Need Attention</h3>
            <div class="metric-value">{{ productsNeedingAttention }}</div>
            <p class="metric-change">Slow-moving or low stock</p>
          </div>
        </mat-card>

        <mat-card class="metric-card">
          <div class="metric-icon success-icon">
            <mat-icon>auto_awesome</mat-icon>
          </div>
          <div class="metric-content">
            <h3>AI Recommendations</h3>
            <div class="metric-value">{{ aiRecommendations }}</div>
            <p class="metric-change">Active suggestions</p>
          </div>
        </mat-card>
      </div>

      <!-- Main Content Tabs -->
      <mat-tab-group class="dashboard-tabs">
        <!-- Product Performance Tab -->
        <mat-tab label="Product Performance">
          <div class="tab-content">
            <div class="section-header">
              <h2>Product Performance Analysis</h2>
              <button mat-raised-button color="primary">
                <mat-icon>refresh</mat-icon>
                Refresh Insights
              </button>
            </div>

            <div class="products-table">
              <table mat-table [dataSource]="productInsights" class="full-width">
                <!-- Product Column -->
                <ng-container matColumnDef="product">
                  <th mat-header-cell *matHeaderCellDef>Product</th>
                  <td mat-cell *matCellDef="let product">
                    <div class="product-cell">
                      <strong>{{ product.name }}</strong>
                    </div>
                  </td>
                </ng-container>

                <!-- Score Column -->
                <ng-container matColumnDef="score">
                  <th mat-header-cell *matHeaderCellDef>Score</th>
                  <td mat-cell *matCellDef="let product">
                    <mat-chip 
                      [class.score-a]="product.performanceScore === 'A'"
                      [class.score-b]="product.performanceScore === 'B'"
                      [class.score-c]="product.performanceScore === 'C'"
                      [class.score-d]="product.performanceScore === 'D'"
                      [class.score-f]="product.performanceScore === 'F'">
                      {{ product.performanceScore }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Trend Column -->
                <ng-container matColumnDef="trend">
                  <th mat-header-cell *matHeaderCellDef>Trend</th>
                  <td mat-cell *matCellDef="let product">
                    <mat-icon 
                      [class.trend-up]="product.salesTrend === 'up'"
                      [class.trend-down]="product.salesTrend === 'down'"
                      [class.trend-stable]="product.salesTrend === 'stable'">
                      {{ product.salesTrend === 'up' ? 'trending_up' : product.salesTrend === 'down' ? 'trending_down' : 'trending_flat' }}
                    </mat-icon>
                  </td>
                </ng-container>

                <!-- Conversion Column -->
                <ng-container matColumnDef="conversion">
                  <th mat-header-cell *matHeaderCellDef>Conversion</th>
                  <td mat-cell *matCellDef="let product">
                    {{ product.conversionRate }}%
                  </td>
                </ng-container>

                <!-- Revenue Column -->
                <ng-container matColumnDef="revenue">
                  <th mat-header-cell *matHeaderCellDef>Revenue</th>
                  <td mat-cell *matCellDef="let product">
                    ${{ product.revenue.toLocaleString() }}
                  </td>
                </ng-container>

                <!-- Action Column -->
                <ng-container matColumnDef="action">
                  <th mat-header-cell *matHeaderCellDef>Recommended Action</th>
                  <td mat-cell *matCellDef="let product">
                    <mat-chip 
                      [class.action-promote]="product.recommendedAction === 'Promote'"
                      [class.action-discount]="product.recommendedAction === 'Discount'"
                      [class.action-hold]="product.recommendedAction === 'Hold'"
                      [class.action-discontinue]="product.recommendedAction === 'Discontinue'">
                      {{ product.recommendedAction }}
                    </mat-chip>
                  </td>
                </ng-container>

                <!-- Details Column -->
                <ng-container matColumnDef="details">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let product">
                    <button mat-icon-button (click)="viewProductDetails(product)">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button (click)="applyRecommendation(product)">
                      <mat-icon>check_circle</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
          </div>
        </mat-tab>

        <!-- Sales Forecasting Tab -->
        <mat-tab label="Sales Forecasting">
          <div class="tab-content">
            <div class="section-header">
              <h2>AI-Powered Sales Forecast</h2>
              <p>Predictive analytics for the next 30 days</p>
            </div>

            <mat-card class="forecast-card">
              <div class="forecast-summary">
                <div class="forecast-item">
                  <h4>Predicted Sales</h4>
                  <p class="forecast-value">{{ forecastedSales }} units</p>
                  <p class="forecast-confidence">Confidence: {{ forecastConfidence }}%</p>
                </div>
                <div class="forecast-item">
                  <h4>Trend</h4>
                  <p class="forecast-value">{{ salesTrend }}</p>
                  <mat-icon [class]="'trend-' + salesTrend.toLowerCase()">
                    {{ salesTrend === 'Increasing' ? 'trending_up' : salesTrend === 'Decreasing' ? 'trending_down' : 'trending_flat' }}
                  </mat-icon>
                </div>
                <div class="forecast-item">
                  <h4>Expected Revenue</h4>
                  <p class="forecast-value">${{ expectedRevenue.toLocaleString() }}</p>
                  <p class="forecast-change positive">+{{ revenueGrowth }}% vs last month</p>
                </div>
              </div>

              <div class="forecast-chart">
                <div class="chart-placeholder">
                  <mat-icon>show_chart</mat-icon>
                  <p>Sales Forecast Chart</p>
                  <p class="chart-note">Integrate with Chart.js or D3.js for visualization</p>
                </div>
              </div>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Inventory Optimization Tab -->
        <mat-tab label="Inventory Optimization">
          <div class="tab-content">
            <div class="section-header">
              <h2>Inventory Intelligence</h2>
              <p>AI recommendations for stock management</p>
            </div>

            <div class="inventory-grid">
              <mat-card class="inventory-card critical">
                <mat-icon>error</mat-icon>
                <h3>Critical Stock</h3>
                <p class="inventory-count">{{ criticalStockCount }}</p>
                <p class="inventory-desc">Products need immediate restock</p>
                <button mat-stroked-button color="warn">View Products</button>
              </mat-card>

              <mat-card class="inventory-card warning">
                <mat-icon>warning</mat-icon>
                <h3>Low Stock</h3>
                <p class="inventory-count">{{ lowStockCount }}</p>
                <p class="inventory-desc">Products below threshold</p>
                <button mat-stroked-button>View Products</button>
              </mat-card>

              <mat-card class="inventory-card slow">
                <mat-icon>schedule</mat-icon>
                <h3>Slow Moving</h3>
                <p class="inventory-count">{{ slowMovingCount }}</p>
                <p class="inventory-desc">Products with low turnover</p>
                <button mat-stroked-button>View Products</button>
              </mat-card>

              <mat-card class="inventory-card overstock">
                <mat-icon>inventory_2</mat-icon>
                <h3>Overstock</h3>
                <p class="inventory-count">{{ overstockCount }}</p>
                <p class="inventory-desc">Products with excess inventory</p>
                <button mat-stroked-button>View Products</button>
              </mat-card>
            </div>

            <mat-card class="recommendations-card">
              <h3>AI Recommendations</h3>
              <div class="recommendation-list">
                <div *ngFor="let rec of inventoryRecommendations" class="recommendation-item">
                  <mat-icon>lightbulb</mat-icon>
                  <div class="recommendation-content">
                    <h4>{{ rec.title }}</h4>
                    <p>{{ rec.description }}</p>
                    <button mat-button color="primary">Apply</button>
                  </div>
                </div>
              </div>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Pricing Optimization Tab -->
        <mat-tab label="Pricing Optimization">
          <div class="tab-content">
            <div class="section-header">
              <h2>AI Pricing Recommendations</h2>
              <p>Optimize prices for maximum profitability</p>
            </div>

            <div class="pricing-recommendations">
              <mat-card *ngFor="let pricing of pricingRecommendations" class="pricing-card">
                <div class="pricing-header">
                  <h3>{{ pricing.productName }}</h3>
                  <mat-chip [class]="'impact-' + pricing.impact">
                    {{ pricing.impact }} Impact
                  </mat-chip>
                </div>
                
                <div class="pricing-comparison">
                  <div class="price-item">
                    <label>Current Price</label>
                    <p class="price">${{ pricing.currentPrice }}</p>
                  </div>
                  <mat-icon>arrow_forward</mat-icon>
                  <div class="price-item recommended">
                    <label>Recommended Price</label>
                    <p class="price">${{ pricing.recommendedPrice }}</p>
                  </div>
                </div>

                <div class="pricing-details">
                  <p><strong>Reasoning:</strong> {{ pricing.reasoning }}</p>
                  <p><strong>Expected Impact:</strong> {{ pricing.expectedImpact }}% increase in sales</p>
                  <p><strong>Competitor Average:</strong> ${{ pricing.competitorAverage }}</p>
                </div>

                <div class="pricing-actions">
                  <button mat-button>Dismiss</button>
                  <button mat-raised-button color="primary">Apply Price</button>
                </div>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Marketing Insights Tab -->
        <mat-tab label="Marketing Insights">
          <div class="tab-content">
            <div class="section-header">
              <h2>AI Marketing Recommendations</h2>
              <p>Data-driven marketing strategies</p>
            </div>

            <div class="marketing-grid">
              <mat-card class="marketing-card">
                <mat-icon class="marketing-icon">campaign</mat-icon>
                <h3>Promotion Opportunities</h3>
                <p>{{ promotionOpportunities }} products ready for promotion</p>
                <ul class="marketing-list">
                  <li>Bundle deals recommended for 5 products</li>
                  <li>Flash sale suggested for slow-moving items</li>
                  <li>Cross-sell opportunities identified</li>
                </ul>
                <button mat-raised-button color="primary">View Details</button>
              </mat-card>

              <mat-card class="marketing-card">
                <mat-icon class="marketing-icon">email</mat-icon>
                <h3>Email Campaign Ideas</h3>
                <p>AI-generated campaign suggestions</p>
                <ul class="marketing-list">
                  <li>Abandoned cart recovery (Est. $2,500 recovery)</li>
                  <li>Product recommendation emails</li>
                  <li>Re-engagement campaign for inactive customers</li>
                </ul>
                <button mat-raised-button color="primary">Create Campaign</button>
              </mat-card>

              <mat-card class="marketing-card">
                <mat-icon class="marketing-icon">share</mat-icon>
                <h3>Social Media Strategy</h3>
                <p>Optimal posting times and content</p>
                <ul class="marketing-list">
                  <li>Best posting time: Tue & Thu, 2-4 PM</li>
                  <li>Top performing content: Product demos</li>
                  <li>Recommended hashtags generated</li>
                </ul>
                <button mat-raised-button color="primary">View Strategy</button>
              </mat-card>

              <mat-card class="marketing-card">
                <mat-icon class="marketing-icon">people</mat-icon>
                <h3>Customer Segmentation</h3>
                <p>AI-identified customer segments</p>
                <ul class="marketing-list">
                  <li>High-value customers: 234 (15%)</li>
                  <li>At-risk customers: 89 (6%)</li>
                  <li>New customers: 156 (10%)</li>
                </ul>
                <button mat-raised-button color="primary">View Segments</button>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .ai-dashboard {
      padding: 2rem;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .dashboard-header p {
      font-size: 1.1rem;
      color: #666;
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
    }

    .metric-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .metric-icon mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: white;
    }

    .ai-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .revenue-icon {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .warning-icon {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .success-icon {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .metric-content {
      flex: 1;
    }

    .metric-content h3 {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .metric-unit {
      font-size: 1.2rem;
      color: #999;
    }

    .metric-change {
      font-size: 0.85rem;
      color: #666;
    }

    .metric-change.positive {
      color: #10b981;
    }

    /* Tabs */
    .dashboard-tabs {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .tab-content {
      padding: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-header h2 {
      font-size: 1.8rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .section-header p {
      color: #666;
      margin: 0.5rem 0 0;
    }

    /* Products Table */
    .products-table {
      overflow-x: auto;
    }

    .full-width {
      width: 100%;
    }

    .product-cell strong {
      color: #333;
    }

    mat-chip {
      font-weight: 600;
    }

    .score-a {
      background: #10b981 !important;
      color: white !important;
    }

    .score-b {
      background: #3b82f6 !important;
      color: white !important;
    }

    .score-c {
      background: #f59e0b !important;
      color: white !important;
    }

    .score-d {
      background: #ef4444 !important;
      color: white !important;
    }

    .score-f {
      background: #991b1b !important;
      color: white !important;
    }

    .trend-up {
      color: #10b981;
    }

    .trend-down {
      color: #ef4444;
    }

    .trend-stable {
      color: #f59e0b;
    }

    .action-promote {
      background: #10b981 !important;
      color: white !important;
    }

    .action-discount {
      background: #f59e0b !important;
      color: white !important;
    }

    .action-hold {
      background: #6b7280 !important;
      color: white !important;
    }

    .action-discontinue {
      background: #ef4444 !important;
      color: white !important;
    }

    /* Forecast Card */
    .forecast-card {
      padding: 2rem;
    }

    .forecast-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .forecast-item h4 {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .forecast-value {
      font-size: 2rem;
      font-weight: 700;
      color: #333;
      margin: 0;
    }

    .forecast-confidence,
    .forecast-change {
      font-size: 0.85rem;
      color: #666;
      margin: 0.25rem 0 0;
    }

    .forecast-change.positive {
      color: #10b981;
    }

    .forecast-chart {
      margin-top: 2rem;
    }

    .chart-placeholder {
      background: #f8f9fa;
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 4rem;
      text-align: center;
    }

    .chart-placeholder mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #999;
    }

    .chart-placeholder p {
      margin: 1rem 0 0;
      color: #666;
    }

    .chart-note {
      font-size: 0.85rem;
      color: #999;
    }

    /* Inventory Grid */
    .inventory-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .inventory-card {
      padding: 2rem;
      text-align: center;
    }

    .inventory-card mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;
    }

    .inventory-card.critical mat-icon {
      color: #ef4444;
    }

    .inventory-card.warning mat-icon {
      color: #f59e0b;
    }

    .inventory-card.slow mat-icon {
      color: #6b7280;
    }

    .inventory-card.overstock mat-icon {
      color: #3b82f6;
    }

    .inventory-count {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin: 0.5rem 0;
    }

    .inventory-desc {
      color: #666;
      margin-bottom: 1rem;
    }

    /* Recommendations */
    .recommendations-card {
      padding: 2rem;
    }

    .recommendation-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .recommendation-item {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .recommendation-item mat-icon {
      color: #667eea;
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .recommendation-content {
      flex: 1;
    }

    .recommendation-content h4 {
      margin: 0 0 0.5rem;
      color: #333;
    }

    .recommendation-content p {
      margin: 0 0 1rem;
      color: #666;
    }

    /* Pricing */
    .pricing-recommendations {
      display: grid;
      gap: 1.5rem;
    }

    .pricing-card {
      padding: 2rem;
    }

    .pricing-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .pricing-header h3 {
      margin: 0;
      color: #333;
    }

    .impact-high {
      background: #10b981 !important;
      color: white !important;
    }

    .impact-medium {
      background: #f59e0b !important;
      color: white !important;
    }

    .impact-low {
      background: #6b7280 !important;
      color: white !important;
    }

    .pricing-comparison {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .price-item {
      flex: 1;
      text-align: center;
    }

    .price-item label {
      display: block;
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .price-item .price {
      font-size: 2rem;
      font-weight: 700;
      color: #333;
      margin: 0;
    }

    .price-item.recommended .price {
      color: #667eea;
    }

    .pricing-details {
      margin-bottom: 1.5rem;
    }

    .pricing-details p {
      margin: 0.5rem 0;
      color: #666;
    }

    .pricing-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    /* Marketing */
    .marketing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .marketing-card {
      padding: 2rem;
    }

    .marketing-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #667eea;
      margin-bottom: 1rem;
    }

    .marketing-card h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .marketing-card > p {
      color: #666;
      margin-bottom: 1rem;
    }

    .marketing-list {
      list-style: none;
      padding: 0;
      margin: 0 0 1.5rem;
    }

    .marketing-list li {
      padding: 0.5rem 0;
      color: #555;
      display: flex;
      align-items: center;
    }

    .marketing-list li::before {
      content: "•";
      color: #667eea;
      font-weight: bold;
      font-size: 1.5rem;
      margin-right: 0.5rem;
    }

    @media (max-width: 768px) {
      .metrics-grid,
      .inventory-grid,
      .marketing-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class AIDashboardComponent implements OnInit {
  // Metrics
  aiScore = 87;
  predictedRevenue = 45230;
  productsNeedingAttention = 12;
  aiRecommendations = 8;

  // Forecast
  forecastedSales = 1250;
  forecastConfidence = 85;
  salesTrend = 'Increasing';
  expectedRevenue = 52000;
  revenueGrowth = 15;

  // Inventory
  criticalStockCount = 5;
  lowStockCount = 12;
  slowMovingCount = 8;
  overstockCount = 3;

  // Marketing
  promotionOpportunities = 15;

  // Table
  displayedColumns = ['product', 'score', 'trend', 'conversion', 'revenue', 'action', 'details'];
  
  productInsights: ProductInsight[] = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      performanceScore: 'A',
      recommendedAction: 'Promote',
      insights: 'High conversion rate, trending up',
      salesTrend: 'up',
      conversionRate: 8.5,
      revenue: 12500,
      stockLevel: 45,
      daysSinceLastSale: 0
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      performanceScore: 'B',
      recommendedAction: 'Hold',
      insights: 'Stable performance, good margins',
      salesTrend: 'stable',
      conversionRate: 5.2,
      revenue: 8900,
      stockLevel: 32,
      daysSinceLastSale: 2
    },
    {
      id: '3',
      name: 'Bluetooth Speaker',
      performanceScore: 'C',
      recommendedAction: 'Discount',
      insights: 'Declining sales, consider promotion',
      salesTrend: 'down',
      conversionRate: 2.8,
      revenue: 3200,
      stockLevel: 78,
      daysSinceLastSale: 15
    },
    {
      id: '4',
      name: 'USB-C Cable',
      performanceScore: 'D',
      recommendedAction: 'Discontinue',
      insights: 'Very low performance, high stock',
      salesTrend: 'down',
      conversionRate: 1.2,
      revenue: 450,
      stockLevel: 150,
      daysSinceLastSale: 45
    }
  ];

  inventoryRecommendations = [
    {
      title: 'Restock Premium Wireless Headphones',
      description: 'Current stock will run out in 5 days based on sales velocity. Recommend ordering 50 units.'
    },
    {
      title: 'Discount Bluetooth Speaker',
      description: 'Product has been slow-moving for 30 days. Consider 20% discount to clear inventory.'
    },
    {
      title: 'Bundle USB-C Cable with other products',
      description: 'Low individual sales. Bundle with phones or laptops to increase turnover.'
    }
  ];

  pricingRecommendations = [
    {
      productName: 'Premium Wireless Headphones',
      currentPrice: 149.99,
      recommendedPrice: 159.99,
      reasoning: 'High demand and low competition. Price increase will improve margins without affecting sales.',
      expectedImpact: 5,
      competitorAverage: 165.00,
      impact: 'high'
    },
    {
      productName: 'Smart Watch Pro',
      currentPrice: 299.99,
      recommendedPrice: 279.99,
      reasoning: 'Competitors offering similar products at lower prices. Small decrease will boost conversions.',
      expectedImpact: 12,
      competitorAverage: 275.00,
      impact: 'medium'
    }
  ];

  ngOnInit(): void {
    // Load AI insights
  }

  viewProductDetails(product: ProductInsight): void {
    console.log('Viewing details for:', product);
  }

  applyRecommendation(product: ProductInsight): void {
    console.log('Applying recommendation for:', product);
  }
}
