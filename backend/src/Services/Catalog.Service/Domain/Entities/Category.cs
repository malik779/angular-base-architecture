using ECommerce.BuildingBlocks.Common.Domain;

namespace ECommerce.Catalog.Service.Domain.Entities;

/// <summary>
/// Product category with hierarchical structure
/// </summary>
public class Category : TenantBaseEntity, IAggregateRoot
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    
    // Hierarchy
    public Guid? ParentCategoryId { get; set; }
    public Category? ParentCategory { get; set; }
    public List<Category> SubCategories { get; set; } = new();
    
    // SEO
    public string? SeoTitle { get; set; }
    public string? SeoDescription { get; set; }
    
    // Display
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public bool ShowInMenu { get; set; }
    
    // Products
    public List<Product> Products { get; set; } = new();
    
    public Category()
    {
        IsActive = true;
        ShowInMenu = true;
    }
}
