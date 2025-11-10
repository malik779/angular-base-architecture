using ECommerce.BuildingBlocks.Common.Domain;

namespace ECommerce.Catalog.Service.Domain.Entities;

/// <summary>
/// Product image entity with AI analysis
/// </summary>
public class ProductImage : TenantBaseEntity
{
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    
    public string Url { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? AltText { get; set; }
    public int SortOrder { get; set; }
    public bool IsPrimary { get; set; }
    
    // Image metadata
    public long FileSizeBytes { get; set; }
    public string? MimeType { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    
    // AI Analysis
    public bool IsAnalyzed { get; set; }
    public List<string> AiTags { get; set; } = new();
    public string? AiDescription { get; set; }
    public decimal? QualityScore { get; set; }
    
    // SVG Conversion (for customization)
    public string? SvgUrl { get; set; }
    public bool IsSvgConverted { get; set; }
    public string? SvgData { get; set; }
}
