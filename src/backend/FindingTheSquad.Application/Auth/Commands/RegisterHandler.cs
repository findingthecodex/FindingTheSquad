using FindingTheSquad.Domain;
using FindingTheSquad.Domain.Interfaces;
using MediatR;

namespace FindingTheSquad.Application.Auth.Commands;

public class RegisterHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;

    public RegisterHandler(IUserRepository userRepository, ITokenService tokenService)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Kolla om email redan finns
        var existingByEmail = await _userRepository.GetByEmailAsync(request.Email);
        if (existingByEmail != null)
            throw new InvalidOperationException("Email already registered");

        // Kolla om username redan finns
        var existingByUsername = await _userRepository.GetByUsernameAsync(request.Username);
        if (existingByUsername != null)
            throw new InvalidOperationException("Username already taken");

        // Hash lösenordet
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Skapa användaren
        var user = new User(request.Email, request.Username, passwordHash);
        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        // Generera token
        var token = _tokenService.GenerateToken(user);

        return new AuthResponse(user.Id, user.Email, user.Username, token);
    }
}
