namespace FindingTheSquad.Domain.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}

