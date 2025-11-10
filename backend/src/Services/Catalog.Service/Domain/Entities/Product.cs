using ECommerce.BuildingBlocks.Common.Domain;

namespace ECommerce.Catalog.Service.Domain.Entities;

/// <summary>
/// Product aggregate root with AI-enhanced features
/// </summary>
public class Product : TenantBaseEntity, IAggregateRoot
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    
    // AI-Generated SEO Fields
    public string? SeoTitle { get; set; }
    public string? SeoDescription { get; set; }
    public string? SeoKeywords { get; set; }
    public bool IsAiOptimized { get; set; }
    public DateTime? LastAiOptimization { get; set; }
    
    // Pricing
    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public decimal? CostPrice { get; set; }
    
    // Inventory
    public int StockQuantity { get; set; }
    public int? LowStockThreshold { get; set; }
    public bool TrackInventory { get; set; }
    public bool AllowBackorder { get; set; }
    
    // Product Status
    public ProductStatus Status { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime? PublishedAt { get; set; }
    
    // Customization
    public bool IsCustomizable { get; set; }
    public ProductCustomizationConfig? CustomizationConfig { get; set; }
    
    // Categories and Tags
    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }
    public List<ProductTag> Tags { get; set; } = new();
    
    // Media
    public List<ProductImage> Images { get; set; } = new();
    public string? FeaturedImageUrl { get; set; }
    
    // Variants
    public List<ProductVariant> Variants { get; set; } = new();
    
    // AI Analytics
    public ProductAnalytics? Analytics { get; set; }
    
    // Social Media
    public SocialMediaPublishStatus? SocialMediaStatus { get; set; }
    
    // Metadata
    public Dictionary<string, string> Metadata { get; set; } = new();
    
    public Product()
    {
        Status = ProductStatus.Draft;
        TrackInventory = true;
        IsCustomizable = false;
    }
}

public enum ProductStatus
{
    Draft,
    Active,
    Inactive,
    OutOfStock,
    Discontinued
}

/// <summary>
/// Product customization configuration
/// </summary>
public class ProductCustomizationConfig
{
    public bool AllowTextCustomization { get; set; }
    public bool AllowColorCustomization { get; set; }
    public bool AllowImageUpload { get; set; }
    public bool AllowLogoPlacement { get; set; }
    public bool AllowDesignSelection { get; set; }
    
    public List<CustomizationArea> CustomizationAreas { get; set; } = new();
    public List<string> AvailableColors { get; set; } = new();
    public List<string> AvailableFonts { get; set; } = new();
    
    public decimal? CustomizationPrice { get; set; }
    public int MaxTextLength { get; set; } = 50;
    public int MaxImageSizeMB { get; set; } = 5;
}

/// <summary>
/// Defines customizable areas on a product (from SVG conversion)
/// </summary>
public class CustomizationArea
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string SvgPath { get; set; } = string.Empty;
    public CustomizationType Type { get; set; }
    public Dictionary<string, object> Constraints { get; set; } = new();
}

public enum CustomizationType
{
    Text,
    Color,
    Image,
    Logo,
    Design
}

/// <summary>
/// Product analytics from AI service
/// </summary>
public class ProductAnalytics
{
    public int ViewCount { get; set; }
    public int PurchaseCount { get; set; }
    public decimal ConversionRate { get; set; }
    public decimal AverageRating { get; set; }
    
    // AI Insights
    public string? PerformanceScore { get; set; } // A, B, C, D, F
    public string? RecommendedAction { get; set; } // "Promote", "Discount", "Hold", "Discontinue"
    public string? AiInsights { get; set; }
    public DateTime? LastAnalyzed { get; set; }
    
    // Predictions
    public int? PredictedSalesNextMonth { get; set; }
    public decimal? RecommendedPrice { get; set; }
    public bool IsSlowMoving { get; set; }
    public int? DaysUntilStockout { get; set; }
}

/// <summary>
/// Social media publishing status
/// </summary>
public class SocialMediaPublishStatus
{
    public bool PublishedToFacebook { get; set; }
    public DateTime? FacebookPublishedAt { get; set; }
    public string? FacebookPostId { get; set; }
    
    public bool PublishedToInstagram { get; set; }
    public DateTime? InstagramPublishedAt { get; set; }
    public string? InstagramPostId { get; set; }
    
    public bool PublishedToWhatsApp { get; set; }
    public DateTime? WhatsAppPublishedAt { get; set; }
}
