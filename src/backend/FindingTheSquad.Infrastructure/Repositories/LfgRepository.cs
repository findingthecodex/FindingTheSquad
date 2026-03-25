using FindingTheSquad.Domain;
using FindingTheSquad.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FindingTheSquad.Infrastructure.Repositories;

public class LfgRepository : ILfgRepository
{
    private readonly AppDbContext _context;

    public LfgRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<LfgSession?> GetByIdAsync(Guid id) 
        => await _context.LfgSessions.FindAsync(id);

    public async Task<IEnumerable<LfgSession>> GetAllActiveAsync() 
        => await _context.LfgSessions.Where(s => s.IsActive).ToListAsync();

    public async Task AddAsync(LfgSession session) 
        => await _context.LfgSessions.AddAsync(session);

    public async Task SaveChangesAsync() 
        => await _context.SaveChangesAsync();
}