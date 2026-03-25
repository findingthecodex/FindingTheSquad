using FindingTheSquad.Application;
using FindingTheSquad.Domain.Interfaces;
using FindingTheSquad.Infrastructure;
using FindingTheSquad.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApplication();
builder.Services.AddControllers();

builder.Services.AddScoped<ILfgRepository, LfgRepository>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=findingthesquad.db;Cache=Shared"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

// Apply migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

app.Run();