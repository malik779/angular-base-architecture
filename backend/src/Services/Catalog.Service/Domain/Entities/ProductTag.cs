using ECommerce.BuildingBlocks.Common.Domain;

namespace ECommerce.Catalog.Service.Domain.Entities;

/// <summary>
/// Product tag for categorization and search
/// </summary>
public class ProductTag : TenantBaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    
    public List<Product> Products { get; set; } = new();
}
