using FindingTheSquad.Domain;
using FindingTheSquad.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FindingTheSquad.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
        => await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<User?> GetByUsernameAsync(string username)
        => await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

    public async Task<User?> GetByIdAsync(Guid id)
        => await _context.Users.FindAsync(id);

    public async Task<List<User>> GetAllAsync()
        => await _context.Users.ToListAsync();

    public async Task AddAsync(User user)
        => await _context.Users.AddAsync(user);

    public async Task SaveChangesAsync()
        => await _context.SaveChangesAsync();
}

