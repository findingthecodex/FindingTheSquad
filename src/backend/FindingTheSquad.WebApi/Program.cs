using FindingTheSquad.Application;
using FindingTheSquad.Domain.Interfaces;
using FindingTheSquad.Infrastructure;
using FindingTheSquad.Infrastructure.Repositories;
using FindingTheSquad.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// JWT Configuration
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured in appsettings");
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// CORS Configuration for Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:3001")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApplication();
builder.Services.AddControllers();
builder.Services.AddHttpClient();

// Register Discord OAuth Options
var discordOptions = new FindingTheSquad.Application.Auth.Commands.DiscordOAuthOptions
{
    ClientId = builder.Configuration["Discord:ClientId"] ?? "",
    ClientSecret = builder.Configuration["Discord:ClientSecret"] ?? "",
    RedirectUri = builder.Configuration["Discord:RedirectUri"] ?? ""
};
builder.Services.AddSingleton(discordOptions);

builder.Services.AddScoped<ILfgRepository, LfgRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=findingthesquad.db;Cache=Shared"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Apply migrations and seed data automatically on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
    System.Threading.Thread.Sleep(500); // Small delay to ensure DB schema is ready
    
    // Seed test user if database is empty
    try
    {
        if (!dbContext.Users.Any())
        {
            var testUser = new FindingTheSquad.Domain.User(
                "kyle.ren@gmail.com",
                "kyloren",
                BCrypt.Net.BCrypt.HashPassword("kyloren123!")
            );
            dbContext.Users.Add(testUser);
            dbContext.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Seed warning: {ex.Message}");
    }
}

app.Run();