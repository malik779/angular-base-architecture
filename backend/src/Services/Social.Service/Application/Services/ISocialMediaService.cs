namespace ECommerce.Social.Service.Application.Services;

/// <summary>
/// Service for social media integrations (Facebook, Instagram, WhatsApp)
/// </summary>
public interface ISocialMediaService
{
    // Facebook Integration
    Task<FacebookPublishResult> PublishToFacebookAsync(FacebookPublishRequest request, CancellationToken cancellationToken = default);
    Task<FacebookAdCampaignResult> CreateFacebookAdCampaignAsync(FacebookAdRequest request, CancellationToken cancellationToken = default);
    Task<bool> SyncToFacebookShopsAsync(Guid productId, Guid tenantId, CancellationToken cancellationToken = default);
    
    // Instagram Integration
    Task<InstagramPublishResult> PublishToInstagramAsync(InstagramPublishRequest request, CancellationToken cancellationToken = default);
    Task<InstagramStoryResult> CreateInstagramStoryAsync(InstagramStoryRequest request, CancellationToken cancellationToken = default);
    
    // WhatsApp Business Integration
    Task<WhatsAppMessageResult> SendWhatsAppMessageAsync(WhatsAppMessageRequest request, CancellationToken cancellationToken = default);
    Task<WhatsAppBroadcastResult> SendWhatsAppBroadcastAsync(WhatsAppBroadcastRequest request, CancellationToken cancellationToken = default);
    Task<bool> ShareCatalogViaWhatsAppAsync(Guid tenantId, string phoneNumber, CancellationToken cancellationToken = default);
    
    // Analytics
    Task<SocialMediaAnalytics> GetSocialMediaAnalyticsAsync(Guid tenantId, DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
}

// Facebook Models
public class FacebookPublishRequest
{
    public Guid TenantId { get; set; }
    public Guid ProductId { get; set; }
    public string Message { get; set; } = string.Empty;
    public List<string> ImageUrls { get; set; } = new();
    public string? Link { get; set; }
    public bool SchedulePost { get; set; }
    public DateTime? ScheduledTime { get; set; }
}

public class FacebookPublishResult
{
    public bool Success { get; set; }
    public string? PostId { get; set; }
    public string? PostUrl { get; set; }
    public string? ErrorMessage { get; set; }
}

public class FacebookAdRequest
{
    public Guid TenantId { get; set; }
    public Guid ProductId { get; set; }
    public string CampaignName { get; set; } = string.Empty;
    public decimal Budget { get; set; }
    public int DurationDays { get; set; }
    public string TargetAudience { get; set; } = string.Empty;
    public string AdObjective { get; set; } = "CONVERSIONS"; // CONVERSIONS, TRAFFIC, AWARENESS
    public List<string> ImageUrls { get; set; } = new();
    public string AdCopy { get; set; } = string.Empty;
    public string CallToAction { get; set; } = "SHOP_NOW";
}

public class FacebookAdCampaignResult
{
    public bool Success { get; set; }
    public string? CampaignId { get; set; }
    public string? AdSetId { get; set; }
    public string? AdId { get; set; }
    public string? ErrorMessage { get; set; }
}

// Instagram Models
public class InstagramPublishRequest
{
    public Guid TenantId { get; set; }
    public Guid ProductId { get; set; }
    public string Caption { get; set; } = string.Empty;
    public List<string> ImageUrls { get; set; } = new();
    public List<string> Hashtags { get; set; } = new();
    public List<ProductTag> ProductTags { get; set; } = new();
}

public class ProductTag
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal X { get; set; } // Position on image (0-1)
    public decimal Y { get; set; } // Position on image (0-1)
}

public class InstagramPublishResult
{
    public bool Success { get; set; }
    public string? MediaId { get; set; }
    public string? Permalink { get; set; }
    public string? ErrorMessage { get; set; }
}

public class InstagramStoryRequest
{
    public Guid TenantId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? SwipeUpUrl { get; set; }
    public List<string> Stickers { get; set; } = new();
}

public class InstagramStoryResult
{
    public bool Success { get; set; }
    public string? StoryId { get; set; }
    public string? ErrorMessage { get; set; }
}

// WhatsApp Models
public class WhatsAppMessageRequest
{
    public Guid TenantId { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public WhatsAppMessageType MessageType { get; set; }
    public string? MediaUrl { get; set; }
    public string? TemplateName { get; set; }
    public Dictionary<string, string>? TemplateParameters { get; set; }
}

public enum WhatsAppMessageType
{
    Text,
    Image,
    Document,
    Template,
    Interactive
}

public class WhatsAppMessageResult
{
    public bool Success { get; set; }
    public string? MessageId { get; set; }
    public string? ErrorMessage { get; set; }
}

public class WhatsAppBroadcastRequest
{
    public Guid TenantId { get; set; }
    public List<string> PhoneNumbers { get; set; } = new();
    public string Message { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }
    public string? TemplateName { get; set; }
}

public class WhatsAppBroadcastResult
{
    public bool Success { get; set; }
    public int TotalSent { get; set; }
    public int Failed { get; set; }
    public List<string> FailedNumbers { get; set; } = new();
}

// Analytics
public class SocialMediaAnalytics
{
    public FacebookAnalytics Facebook { get; set; } = new();
    public InstagramAnalytics Instagram { get; set; } = new();
    public WhatsAppAnalytics WhatsApp { get; set; } = new();
}

public class FacebookAnalytics
{
    public int TotalPosts { get; set; }
    public int TotalReach { get; set; }
    public int TotalEngagement { get; set; }
    public int TotalClicks { get; set; }
    public decimal TotalAdSpend { get; set; }
    public decimal ROI { get; set; }
}

public class InstagramAnalytics
{
    public int TotalPosts { get; set; }
    public int TotalReach { get; set; }
    public int TotalEngagement { get; set; }
    public int TotalStories { get; set; }
    public int ProfileVisits { get; set; }
}

public class WhatsAppAnalytics
{
    public int TotalMessagesSent { get; set; }
    public int TotalMessagesDelivered { get; set; }
    public int TotalMessagesRead { get; set; }
    public int TotalReplies { get; set; }
}
