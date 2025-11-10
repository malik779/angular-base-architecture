using ECommerce.BuildingBlocks.Common.Domain;

namespace ECommerce.Subscription.Service.Domain.Entities;

/// <summary>
/// Subscription plan with features and limits
/// </summary>
public class SubscriptionPlan : BaseEntity, IAggregateRoot
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    // Pricing
    public decimal MonthlyPrice { get; set; }
    public decimal YearlyPrice { get; set; }
    public decimal? SetupFee { get; set; }
    
    // Trial
    public int TrialDays { get; set; }
    
    // Features
    public PlanFeatures Features { get; set; } = new();
    
    // Limits
    public PlanLimits Limits { get; set; } = new();
    
    // Display
    public int SortOrder { get; set; }
    public bool IsPopular { get; set; }
    public bool IsActive { get; set; }
    public bool IsPublic { get; set; }
    
    // Stripe Integration
    public string? StripePriceIdMonthly { get; set; }
    public string? StripePriceIdYearly { get; set; }
    
    public SubscriptionPlan()
    {
        IsActive = true;
        IsPublic = true;
        TrialDays = 14;
    }
}

/// <summary>
/// Features included in a subscription plan
/// </summary>
public class PlanFeatures
{
    // Core Features
    public bool ProductManagement { get; set; } = true;
    public bool OrderManagement { get; set; } = true;
    public bool CustomerManagement { get; set; } = true;
    public bool InventoryManagement { get; set; } = true;
    
    // Advanced Features
    public bool ProductCustomization { get; set; }
    public bool AIProductOptimization { get; set; }
    public bool AIAnalyticsDashboard { get; set; }
    public bool AIContentGeneration { get; set; }
    
    // Social Media
    public bool FacebookIntegration { get; set; }
    public bool InstagramIntegration { get; set; }
    public bool WhatsAppIntegration { get; set; }
    public bool SocialMediaAds { get; set; }
    
    // Branding
    public bool CustomDomain { get; set; }
    public bool CustomTheme { get; set; }
    public bool CustomEmailTemplates { get; set; }
    public bool RemoveBranding { get; set; }
    
    // Payment
    public bool MultiplePaymentGateways { get; set; }
    public bool SubscriptionProducts { get; set; }
    
    // Marketing
    public bool EmailMarketing { get; set; }
    public bool DiscountCodes { get; set; }
    public bool AbandonedCartRecovery { get; set; }
    
    // Analytics
    public bool AdvancedAnalytics { get; set; }
    public bool CustomReports { get; set; }
    
    // Support
    public string SupportLevel { get; set; } = "Email"; // Email, Priority, Dedicated
    public bool PrioritySupport { get; set; }
}

/// <summary>
/// Resource limits for a subscription plan
/// </summary>
public class PlanLimits
{
    public int MaxProducts { get; set; } = 100;
    public int MaxOrders { get; set; } = 1000;
    public int MaxUsers { get; set; } = 5;
    public long MaxStorageGB { get; set; } = 10;
    public int MaxApiCallsPerMonth { get; set; } = 10000;
    public int MaxEmailsPerMonth { get; set; } = 1000;
    public int MaxProductImages { get; set; } = 10;
    public bool UnlimitedProducts { get; set; }
    public bool UnlimitedOrders { get; set; }
    public bool UnlimitedStorage { get; set; }
}
