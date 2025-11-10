import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule
  ],
  template: `
    <div class="landing-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">AI-Powered Multi-Tenant E-Commerce Platform</h1>
          <p class="hero-subtitle">
            Transform your online business with intelligent automation, seamless integrations, 
            and powerful customization tools
          </p>
          <div class="hero-actions">
            <button mat-raised-button color="primary" class="cta-button" routerLink="/auth/register">
              Start Free Trial
            </button>
            <button mat-stroked-button class="demo-button" (click)="scrollToVideo()">
              <mat-icon>play_circle</mat-icon>
              Watch Demo
            </button>
          </div>
          <p class="trial-info">14-day free trial • No credit card required</p>
        </div>
        <div class="hero-image">
          <img src="assets/images/hero-dashboard.png" alt="Platform Dashboard" />
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="section-header">
          <h2>Powered by Artificial Intelligence</h2>
          <p>Leverage cutting-edge AI to boost sales, optimize products, and automate marketing</p>
        </div>
        
        <div class="features-grid">
          <mat-card class="feature-card">
            <mat-icon class="feature-icon ai-icon">psychology</mat-icon>
            <h3>AI Product Optimization</h3>
            <p>
              Automatically generate SEO-optimized titles, descriptions, and keywords. 
              AI analyzes your products and suggests improvements for better visibility.
            </p>
            <ul class="feature-list">
              <li>Auto-generated SEO content</li>
              <li>Image quality analysis</li>
              <li>Competitive pricing insights</li>
              <li>Product tagging & categorization</li>
            </ul>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon class="feature-icon ai-icon">insights</mat-icon>
            <h3>AI Intelligence Dashboard</h3>
            <p>
              Get actionable insights on product performance, inventory management, 
              and sales forecasting powered by machine learning.
            </p>
            <ul class="feature-list">
              <li>Sales trend prediction</li>
              <li>Slow-moving product alerts</li>
              <li>Promotion recommendations</li>
              <li>Demand forecasting</li>
            </ul>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon class="feature-icon">brush</mat-icon>
            <h3>Product Customization Builder</h3>
            <p>
              Let customers personalize products with text, colors, logos, and designs. 
              SVG-based visual configurator with real-time preview.
            </p>
            <ul class="feature-list">
              <li>Visual product configurator</li>
              <li>SVG image conversion</li>
              <li>Custom text & logos</li>
              <li>Real-time preview</li>
            </ul>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon class="feature-icon">share</mat-icon>
            <h3>Social Media Integration</h3>
            <p>
              Publish products directly to Facebook, Instagram, and WhatsApp. 
              Create ad campaigns from your admin panel.
            </p>
            <ul class="feature-list">
              <li>One-click social publishing</li>
              <li>Facebook & Instagram Shops</li>
              <li>WhatsApp Business API</li>
              <li>Automated ad campaigns</li>
            </ul>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon class="feature-icon">store</mat-icon>
            <h3>Multi-Tenant Architecture</h3>
            <p>
              Each tenant gets their own branded storefront with custom domain, 
              theme, and complete data isolation.
            </p>
            <ul class="feature-list">
              <li>Custom domain mapping</li>
              <li>White-label branding</li>
              <li>Isolated databases</li>
              <li>Tenant-specific features</li>
            </ul>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon class="feature-icon">payment</mat-icon>
            <h3>Multiple Payment Gateways</h3>
            <p>
              Accept payments through Stripe, PayPal, Razorpay, and more. 
              Configurable per tenant with secure processing.
            </p>
            <ul class="feature-list">
              <li>Stripe integration</li>
              <li>PayPal support</li>
              <li>Razorpay for India</li>
              <li>PCI compliant</li>
            </ul>
          </mat-card>
        </div>
      </section>

      <!-- Video Demo Section -->
      <section class="video-section" #videoSection>
        <div class="section-header">
          <h2>See It In Action</h2>
          <p>Watch how our AI-powered platform transforms e-commerce businesses</p>
        </div>
        <div class="video-container">
          <iframe 
            width="100%" 
            height="600" 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="Platform Demo" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      </section>

      <!-- Pricing Section -->
      <section class="pricing-section">
        <div class="section-header">
          <h2>Choose Your Plan</h2>
          <p>Start with a 14-day free trial. No credit card required.</p>
        </div>

        <div class="pricing-grid">
          <mat-card class="pricing-card">
            <div class="plan-header">
              <h3>Starter</h3>
              <div class="price">
                <span class="currency">$</span>
                <span class="amount">29</span>
                <span class="period">/month</span>
              </div>
            </div>
            <ul class="plan-features">
              <li><mat-icon>check</mat-icon> Up to 100 products</li>
              <li><mat-icon>check</mat-icon> 1,000 orders/month</li>
              <li><mat-icon>check</mat-icon> Basic AI optimization</li>
              <li><mat-icon>check</mat-icon> Email support</li>
              <li><mat-icon>check</mat-icon> 10GB storage</li>
              <li><mat-icon>close</mat-icon> Custom domain</li>
              <li><mat-icon>close</mat-icon> Social media ads</li>
            </ul>
            <button mat-raised-button color="primary" class="plan-button">
              Start Free Trial
            </button>
          </mat-card>

          <mat-card class="pricing-card popular">
            <div class="popular-badge">Most Popular</div>
            <div class="plan-header">
              <h3>Professional</h3>
              <div class="price">
                <span class="currency">$</span>
                <span class="amount">99</span>
                <span class="period">/month</span>
              </div>
            </div>
            <ul class="plan-features">
              <li><mat-icon>check</mat-icon> Up to 1,000 products</li>
              <li><mat-icon>check</mat-icon> Unlimited orders</li>
              <li><mat-icon>check</mat-icon> Full AI suite</li>
              <li><mat-icon>check</mat-icon> Priority support</li>
              <li><mat-icon>check</mat-icon> 100GB storage</li>
              <li><mat-icon>check</mat-icon> Custom domain</li>
              <li><mat-icon>check</mat-icon> Social media integration</li>
              <li><mat-icon>check</mat-icon> Product customization</li>
            </ul>
            <button mat-raised-button color="accent" class="plan-button">
              Start Free Trial
            </button>
          </mat-card>

          <mat-card class="pricing-card">
            <div class="plan-header">
              <h3>Enterprise</h3>
              <div class="price">
                <span class="currency">$</span>
                <span class="amount">299</span>
                <span class="period">/month</span>
              </div>
            </div>
            <ul class="plan-features">
              <li><mat-icon>check</mat-icon> Unlimited products</li>
              <li><mat-icon>check</mat-icon> Unlimited orders</li>
              <li><mat-icon>check</mat-icon> Advanced AI analytics</li>
              <li><mat-icon>check</mat-icon> Dedicated support</li>
              <li><mat-icon>check</mat-icon> Unlimited storage</li>
              <li><mat-icon>check</mat-icon> Multiple domains</li>
              <li><mat-icon>check</mat-icon> White-label branding</li>
              <li><mat-icon>check</mat-icon> API access</li>
              <li><mat-icon>check</mat-icon> Custom integrations</li>
            </ul>
            <button mat-raised-button color="primary" class="plan-button">
              Contact Sales
            </button>
          </mat-card>
        </div>
      </section>

      <!-- Comparison Section -->
      <section class="comparison-section">
        <div class="section-header">
          <h2>Why Choose Our Platform?</h2>
          <p>See how we compare to traditional e-commerce solutions</p>
        </div>

        <div class="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Traditional Platforms</th>
                <th class="highlight">Our Platform</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AI Product Optimization</td>
                <td><mat-icon class="no">close</mat-icon></td>
                <td class="highlight"><mat-icon class="yes">check</mat-icon></td>
              </tr>
              <tr>
                <td>AI Sales Intelligence</td>
                <td><mat-icon class="no">close</mat-icon></td>
                <td class="highlight"><mat-icon class="yes">check</mat-icon></td>
              </tr>
              <tr>
                <td>Product Customization Builder</td>
                <td><mat-icon class="no">close</mat-icon></td>
                <td class="highlight"><mat-icon class="yes">check</mat-icon></td>
              </tr>
              <tr>
                <td>Direct Social Media Publishing</td>
                <td><mat-icon class="partial">remove</mat-icon></td>
                <td class="highlight"><mat-icon class="yes">check</mat-icon></td>
              </tr>
              <tr>
                <td>WhatsApp Business Integration</td>
                <td><mat-icon class="no">close</mat-icon></td>
                <td class="highlight"><mat-icon class="yes">check</mat-icon></td>
              </tr>
              <tr>
                <td>Multi-Tenant Architecture</td>
                <td><mat-icon class="partial">remove</mat-icon></td>
                <td class="highlight"><mat-icon class="yes">check</mat-icon></td>
              </tr>
              <tr>
                <td>Custom Domain per Tenant</td>
                <td><mat-icon class="no">close</mat-icon></td>
                <td class="highlight"><mat-icon class="yes">check</mat-icon></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <h2>Ready to Transform Your E-Commerce Business?</h2>
        <p>Join thousands of businesses using AI to boost their sales</p>
        <button mat-raised-button color="accent" class="cta-button" routerLink="/auth/register">
          Start Your Free Trial Today
        </button>
        <p class="cta-subtext">No credit card required • 14-day free trial • Cancel anytime</p>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="footer-content">
          <div class="footer-section">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Demo</a>
            <a href="#">API</a>
          </div>
          <div class="footer-section">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div class="footer-section">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">Help Center</a>
            <a href="#">Community</a>
            <a href="#">Status</a>
          </div>
          <div class="footer-section">
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
            <a href="#">GDPR</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 AI E-Commerce Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing-page {
      width: 100%;
      overflow-x: hidden;
    }

    /* Hero Section */
    .hero-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      padding: 6rem 5%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      align-items: center;
    }

    .hero-content {
      max-width: 600px;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.95;
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .cta-button {
      font-size: 1.1rem !important;
      padding: 0.75rem 2rem !important;
      height: auto !important;
    }

    .demo-button {
      font-size: 1.1rem !important;
      padding: 0.75rem 2rem !important;
      height: auto !important;
      background: rgba(255, 255, 255, 0.1) !important;
      color: white !important;
      border-color: white !important;
    }

    .trial-info {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .hero-image img {
      width: 100%;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    /* Features Section */
    .features-section {
      padding: 6rem 5%;
      background: #f8f9fa;
    }

    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-header h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #333;
    }

    .section-header p {
      font-size: 1.2rem;
      color: #666;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      padding: 2rem;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .feature-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #667eea;
      margin-bottom: 1rem;
    }

    .ai-icon {
      color: #764ba2;
    }

    .feature-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #333;
    }

    .feature-card p {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .feature-list {
      list-style: none;
      padding: 0;
    }

    .feature-list li {
      padding: 0.5rem 0;
      color: #555;
      display: flex;
      align-items: center;
    }

    .feature-list li::before {
      content: "✓";
      color: #667eea;
      font-weight: bold;
      margin-right: 0.5rem;
    }

    /* Video Section */
    .video-section {
      padding: 6rem 5%;
      background: white;
    }

    .video-container {
      max-width: 1200px;
      margin: 0 auto;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }

    /* Pricing Section */
    .pricing-section {
      padding: 6rem 5%;
      background: #f8f9fa;
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .pricing-card {
      padding: 2rem;
      position: relative;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .pricing-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .pricing-card.popular {
      border: 3px solid #667eea;
      transform: scale(1.05);
    }

    .popular-badge {
      position: absolute;
      top: -12px;
      right: 20px;
      background: #667eea;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .plan-header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 2px solid #eee;
    }

    .plan-header h3 {
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #333;
    }

    .price {
      display: flex;
      align-items: baseline;
      justify-content: center;
    }

    .currency {
      font-size: 1.5rem;
      color: #666;
    }

    .amount {
      font-size: 3rem;
      font-weight: 700;
      color: #333;
    }

    .period {
      font-size: 1rem;
      color: #666;
      margin-left: 0.5rem;
    }

    .plan-features {
      list-style: none;
      padding: 0;
      margin-bottom: 2rem;
    }

    .plan-features li {
      padding: 0.75rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #555;
    }

    .plan-features mat-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    .plan-features mat-icon.check {
      color: #10b981;
    }

    .plan-features mat-icon.close {
      color: #ccc;
    }

    .plan-button {
      width: 100%;
      padding: 0.75rem !important;
      height: auto !important;
      font-size: 1rem !important;
    }

    /* Comparison Section */
    .comparison-section {
      padding: 6rem 5%;
      background: white;
    }

    .comparison-table {
      max-width: 900px;
      margin: 0 auto;
      overflow-x: auto;
    }

    .comparison-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .comparison-table th,
    .comparison-table td {
      padding: 1.5rem;
      text-align: center;
      border-bottom: 1px solid #eee;
    }

    .comparison-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
    }

    .comparison-table th.highlight,
    .comparison-table td.highlight {
      background: #f0f4ff;
      color: #667eea;
      font-weight: 600;
    }

    .comparison-table mat-icon.yes {
      color: #10b981;
    }

    .comparison-table mat-icon.no {
      color: #ef4444;
    }

    .comparison-table mat-icon.partial {
      color: #f59e0b;
    }

    /* CTA Section */
    .cta-section {
      padding: 6rem 5%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }

    .cta-section h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .cta-section p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.95;
    }

    .cta-subtext {
      font-size: 0.9rem;
      margin-top: 1rem;
      opacity: 0.9;
    }

    /* Footer */
    .landing-footer {
      background: #1a1a1a;
      color: white;
      padding: 4rem 5% 2rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .footer-section h4 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .footer-section a {
      display: block;
      color: #aaa;
      text-decoration: none;
      margin-bottom: 0.75rem;
      transition: color 0.3s;
    }

    .footer-section a:hover {
      color: white;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #333;
      color: #aaa;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-section {
        grid-template-columns: 1fr;
        padding: 3rem 5%;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-actions {
        flex-direction: column;
      }

      .section-header h2 {
        font-size: 2rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .pricing-grid {
        grid-template-columns: 1fr;
      }

      .pricing-card.popular {
        transform: scale(1);
      }
    }
  `]
})
export class LandingComponent implements OnInit {
  
  ngOnInit(): void {
    // Initialize any animations or tracking
  }

  scrollToVideo(): void {
    const videoSection = document.querySelector('.video-section');
    videoSection?.scrollIntoView({ behavior: 'smooth' });
  }
}
