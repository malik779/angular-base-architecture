namespace ECommerce.AI.Service.Application.Services;

/// <summary>
/// AI service for product enhancement and optimization
/// </summary>
public interface IProductAIService
{
    /// <summary>
    /// Generate SEO-optimized content for a product
    /// </summary>
    Task<ProductSeoContent> GenerateSeoContentAsync(ProductSeoRequest request, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Generate compelling product description
    /// </summary>
    Task<string> GenerateProductDescriptionAsync(ProductDescriptionRequest request, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Analyze product image and generate tags
    /// </summary>
    Task<ImageAnalysisResult> AnalyzeProductImageAsync(string imageUrl, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get AI-powered pricing recommendations
    /// </summary>
    Task<PricingRecommendation> GetPricingRecommendationAsync(PricingAnalysisRequest request, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Generate product performance insights
    /// </summary>
    Task<ProductInsights> GenerateProductInsightsAsync(ProductPerformanceData data, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Predict product demand
    /// </summary>
    Task<DemandForecast> PredictDemandAsync(DemandPredictionRequest request, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Get recommendations for slow-moving products
    /// </summary>
    Task<List<ProductRecommendation>> GetSlowMovingProductRecommendationsAsync(Guid tenantId, CancellationToken cancellationToken = default);
}

public class ProductSeoRequest
{
    public string ProductName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public List<string> Features { get; set; } = new();
    public decimal? Price { get; set; }
}

public class ProductSeoContent
{
    public string SeoTitle { get; set; } = string.Empty;
    public string SeoDescription { get; set; } = string.Empty;
    public List<string> Keywords { get; set; } = new();
    public string? MetaDescription { get; set; }
}

public class ProductDescriptionRequest
{
    public string ProductName { get; set; } = string.Empty;
    public string? Category { get; set; }
    public List<string> Features { get; set; } = new();
    public List<string> Benefits { get; set; } = new();
    public string? TargetAudience { get; set; }
    public string? Tone { get; set; } // "Professional", "Casual", "Luxury", etc.
}

public class ImageAnalysisResult
{
    public List<string> Tags { get; set; } = new();
    public string Description { get; set; } = string.Empty;
    public decimal QualityScore { get; set; }
    public List<string> SuggestedImprovements { get; set; } = new();
    public bool IsProductCentered { get; set; }
    public string? DominantColor { get; set; }
}

public class PricingAnalysisRequest
{
    public Guid ProductId { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal? CostPrice { get; set; }
    public int SalesLast30Days { get; set; }
    public int ViewsLast30Days { get; set; }
    public List<CompetitorPrice> CompetitorPrices { get; set; } = new();
}

public class CompetitorPrice
{
    public string CompetitorName { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public class PricingRecommendation
{
    public decimal RecommendedPrice { get; set; }
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
    public string Reasoning { get; set; } = string.Empty;
    public decimal ExpectedImpact { get; set; } // Percentage change in sales
}

public class ProductPerformanceData
{
    public Guid ProductId { get; set; }
    public int ViewCount { get; set; }
    public int PurchaseCount { get; set; }
    public decimal Revenue { get; set; }
    public int StockQuantity { get; set; }
    public int DaysSinceLastSale { get; set; }
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
}

public class ProductInsights
{
    public string PerformanceScore { get; set; } = string.Empty; // A, B, C, D, F
    public string RecommendedAction { get; set; } = string.Empty;
    public string DetailedInsights { get; set; } = string.Empty;
    public List<string> ActionItems { get; set; } = new();
    public bool IsSlowMoving { get; set; }
    public int? DaysUntilStockout { get; set; }
}

public class DemandPredictionRequest
{
    public Guid ProductId { get; set; }
    public List<HistoricalSalesData> HistoricalData { get; set; } = new();
    public int ForecastDays { get; set; } = 30;
}

public class HistoricalSalesData
{
    public DateTime Date { get; set; }
    public int UnitsSold { get; set; }
    public decimal Revenue { get; set; }
}

public class DemandForecast
{
    public int PredictedSales { get; set; }
    public decimal Confidence { get; set; }
    public List<DailyForecast> DailyForecasts { get; set; } = new();
    public string Trend { get; set; } = string.Empty; // "Increasing", "Stable", "Decreasing"
}

public class DailyForecast
{
    public DateTime Date { get; set; }
    public int PredictedUnits { get; set; }
}

public class ProductRecommendation
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string RecommendationType { get; set; } = string.Empty; // "Discount", "Promote", "Bundle", "Discontinue"
    public string Reasoning { get; set; } = string.Empty;
    public decimal? SuggestedDiscountPercentage { get; set; }
    public List<Guid>? SuggestedBundleProducts { get; set; }
}
