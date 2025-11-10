using ECommerce.BuildingBlocks.Common.Domain;

namespace ECommerce.Subscription.Service.Domain.Entities;

/// <summary>
/// Tenant entity for multi-tenancy
/// </summary>
public class Tenant : BaseEntity, IAggregateRoot
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Domain { get; set; } // Custom domain
    public string? Subdomain { get; set; } // tenant.platform.com
    
    // Contact Information
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Address { get; set; }
    
    // Subscription
    public Guid SubscriptionPlanId { get; set; }
    public SubscriptionPlan? SubscriptionPlan { get; set; }
    public SubscriptionStatus Status { get; set; }
    public DateTime SubscriptionStartDate { get; set; }
    public DateTime? SubscriptionEndDate { get; set; }
    public DateTime? TrialEndDate { get; set; }
    public bool IsTrialActive { get; set; }
    
    // Billing
    public string? StripeCustomerId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public BillingCycle BillingCycle { get; set; }
    public DateTime? NextBillingDate { get; set; }
    
    // Branding
    public TenantBranding? Branding { get; set; }
    
    // Configuration
    public TenantConfiguration Configuration { get; set; } = new();
    
    // Usage Tracking
    public TenantUsage Usage { get; set; } = new();
    
    // Status
    public bool IsActive { get; set; }
    public string? DeactivationReason { get; set; }
    
    public Tenant()
    {
        Status = SubscriptionStatus.Trial;
        IsTrialActive = true;
        IsActive = true;
        BillingCycle = BillingCycle.Monthly;
    }
}

public enum SubscriptionStatus
{
    Trial,
    Active,
    PastDue,
    Cancelled,
    Suspended
}

public enum BillingCycle
{
    Monthly,
    Quarterly,
    Yearly
}

/// <summary>
/// Tenant branding configuration
/// </summary>
public class TenantBranding
{
    public string? LogoUrl { get; set; }
    public string? FaviconUrl { get; set; }
    public string PrimaryColor { get; set; } = "#3f51b5";
    public string SecondaryColor { get; set; } = "#ff4081";
    public string? CustomCss { get; set; }
    public string? ThemeId { get; set; }
}

/// <summary>
/// Tenant configuration settings
/// </summary>
public class TenantConfiguration
{
    // Features
    public Dictionary<string, bool> EnabledFeatures { get; set; } = new();
    
    // Email Settings
    public EmailConfiguration? EmailConfig { get; set; }
    
    // Payment Settings
    public PaymentConfiguration? PaymentConfig { get; set; }
    
    // Social Media
    public SocialMediaConfiguration? SocialMediaConfig { get; set; }
    
    // Store Settings
    public StoreConfiguration StoreConfig { get; set; } = new();
}

public class EmailConfiguration
{
    public string? SmtpHost { get; set; }
    public int SmtpPort { get; set; }
    public string? SmtpUsername { get; set; }
    public string? SmtpPassword { get; set; }
    public string? FromEmail { get; set; }
    public string? FromName { get; set; }
    public bool UseSsl { get; set; }
}

public class PaymentConfiguration
{
    public bool StripeEnabled { get; set; }
    public string? StripePublishableKey { get; set; }
    public string? StripeSecretKey { get; set; }
    
    public bool PayPalEnabled { get; set; }
    public string? PayPalClientId { get; set; }
    public string? PayPalClientSecret { get; set; }
    
    public bool RazorpayEnabled { get; set; }
    public string? RazorpayKeyId { get; set; }
    public string? RazorpayKeySecret { get; set; }
}

public class SocialMediaConfiguration
{
    public FacebookConfig? Facebook { get; set; }
    public InstagramConfig? Instagram { get; set; }
    public WhatsAppConfig? WhatsApp { get; set; }
}

public class FacebookConfig
{
    public string? PageId { get; set; }
    public string? AccessToken { get; set; }
    public string? AppId { get; set; }
    public string? AppSecret { get; set; }
    public bool AutoPublish { get; set; }
}

public class InstagramConfig
{
    public string? BusinessAccountId { get; set; }
    public string? AccessToken { get; set; }
    public bool AutoPublish { get; set; }
}

public class WhatsAppConfig
{
    public string? PhoneNumberId { get; set; }
    public string? AccessToken { get; set; }
    public string? BusinessAccountId { get; set; }
    public bool EnableNotifications { get; set; }
}

public class StoreConfiguration
{
    public string Currency { get; set; } = "USD";
    public string Timezone { get; set; } = "UTC";
    public string Language { get; set; } = "en";
    public bool TaxEnabled { get; set; }
    public decimal? TaxRate { get; set; }
    public bool ShippingEnabled { get; set; }
}

/// <summary>
/// Tenant usage tracking for quota management
/// </summary>
public class TenantUsage
{
    public int ProductCount { get; set; }
    public int OrderCount { get; set; }
    public int UserCount { get; set; }
    public long StorageUsedBytes { get; set; }
    public int ApiCallsThisMonth { get; set; }
    public int EmailsSentThisMonth { get; set; }
    public DateTime LastUpdated { get; set; }
}
