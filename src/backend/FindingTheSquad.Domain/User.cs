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

