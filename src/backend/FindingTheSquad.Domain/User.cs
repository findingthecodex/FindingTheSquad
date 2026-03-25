namespace FindingTheSquad.Domain;

public class User
{
    public Guid Id { get; private set; }
    public string Email { get; private set; } = string.Empty;
    public string Username { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public UserRole Role { get; private set; } = UserRole.User;
    public DateTime CreatedAt { get; private set; }
    public bool IsActive { get; private set; }
    
    // OAuth/Social Login
    public string? DiscordId { get; private set; }
    public string? DiscordUsername { get; private set; }
    public string? DiscordAvatar { get; private set; }
    public string? SteamId { get; private set; }
    public string? GitHubId { get; private set; }
    public string? GoogleId { get; private set; }

    private User() { }

    public User(string email, string username, string passwordHash)
    {
        Id = Guid.NewGuid();
        Email = email;
        Username = username;
        PasswordHash = passwordHash;
        Role = UserRole.User;
        CreatedAt = DateTime.UtcNow;
        IsActive = true;
    }

    // Constructor for OAuth users
    public User(string email, string username, string? discordId = null, string? discordUsername = null, string? discordAvatar = null)
    {
        Id = Guid.NewGuid();
        Email = email;
        Username = username;
        PasswordHash = ""; // OAuth users don't have password
        DiscordId = discordId;
        DiscordUsername = discordUsername;
        DiscordAvatar = discordAvatar;
        Role = UserRole.User;
        CreatedAt = DateTime.UtcNow;
        IsActive = true;
    }

    public void UpdateDiscordInfo(string discordId, string discordUsername, string discordAvatar)
    {
        DiscordId = discordId;
        DiscordUsername = discordUsername;
        DiscordAvatar = discordAvatar;
    }

    public void Deactivate()
    {
        IsActive = false;
    }
}

public enum UserRole
{
    User = 0,
    Admin = 1
}

