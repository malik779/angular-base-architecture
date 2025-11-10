namespace ECommerce.BuildingBlocks.Common.Domain;

/// <summary>
/// Base entity with common properties for all domain entities
/// </summary>
public abstract class BaseEntity
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }

    protected BaseEntity()
    {
        Id = Guid.NewGuid();
        CreatedAt = DateTime.UtcNow;
        IsDeleted = false;
    }
}

/// <summary>
/// Base entity for multi-tenant entities
/// </summary>
public abstract class TenantBaseEntity : BaseEntity
{
    public Guid TenantId { get; set; }
    
    protected TenantBaseEntity() : base()
    {
    }
}
