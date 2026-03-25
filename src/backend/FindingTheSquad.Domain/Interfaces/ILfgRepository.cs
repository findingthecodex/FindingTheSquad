namespace FindingTheSquad.Domain.Interfaces;

public interface ILfgRepository
{
    Task<LfgSession?> GetByIdAsync(Guid id);
    Task<IEnumerable<LfgSession>> GetAllActiveAsync();
    Task AddAsync(LfgSession session);
    Task SaveChangesAsync();
}