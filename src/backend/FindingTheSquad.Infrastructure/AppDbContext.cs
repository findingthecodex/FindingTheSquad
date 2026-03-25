using FindingTheSquad.Domain;
using Microsoft.EntityFrameworkCore;

namespace FindingTheSquad.Infrastructure;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // Här definierar vi vår tabell
    public DbSet<LfgSession> LfgSessions => Set<LfgSession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Här kan vi konfigurera tabellen lite extra om vi vill
        modelBuilder.Entity<LfgSession>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PlayerName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.GameTitle).IsRequired().HasMaxLength(100);
        });
    }
}