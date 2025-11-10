using System.Linq.Expressions;
using ECommerce.BuildingBlocks.Common.Domain;

namespace ECommerce.BuildingBlocks.Common.Application;

/// <summary>
/// Generic repository interface following Repository pattern
/// </summary>
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);
    Task<T> AddAsync(T entity, CancellationToken cancellationToken = default);
    Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities, CancellationToken cancellationToken = default);
    Task UpdateAsync(T entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(T entity, CancellationToken cancellationToken = default);
    Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default);
    Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(
        int page, 
        int pageSize, 
        Expression<Func<T, bool>>? predicate = null,
        Expression<Func<T, object>>? orderBy = null,
        bool ascending = true,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for tenant-specific entities
/// </summary>
public interface ITenantRepository<T> : IRepository<T> where T : TenantBaseEntity
{
    Task<IEnumerable<T>> GetByTenantAsync(Guid tenantId, CancellationToken cancellationToken = default);
    Task<T?> GetByIdAndTenantAsync(Guid id, Guid tenantId, CancellationToken cancellationToken = default);
}
