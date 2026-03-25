using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FindingTheSquad.Infrastructure;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        // Database is configured in Program.cs - this is only used for design-time operations like migrations
        // Point to the WebApi's database location
        optionsBuilder.UseSqlite("Data Source=../FindingTheSquad.WebApi/findingthesquad.db;Cache=Shared");

        return new AppDbContext(optionsBuilder.Options);
    }
}