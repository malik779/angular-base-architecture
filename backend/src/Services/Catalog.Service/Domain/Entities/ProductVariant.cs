using ECommerce.BuildingBlocks.Common.Domain;

namespace ECommerce.Catalog.Service.Domain.Entities;

/// <summary>
/// Product variant (e.g., different sizes, colors)
/// </summary>
public class ProductVariant : TenantBaseEntity
{
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    
    // Pricing
    public decimal? Price { get; set; } // If null, uses product price
    public decimal? CompareAtPrice { get; set; }
    
    // Inventory
    public int StockQuantity { get; set; }
    
    // Attributes
    public Dictionary<string, string> Attributes { get; set; } = new();
    // Example: { "Size": "Large", "Color": "Red" }
    
    // Media
    public string? ImageUrl { get; set; }
    
    // Status
    public bool IsActive { get; set; }
    
    public ProductVariant()
    {
        IsActive = true;
    }
}
