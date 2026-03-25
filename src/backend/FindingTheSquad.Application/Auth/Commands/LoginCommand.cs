using MediatR;

namespace FindingTheSquad.Application.Auth.Commands;

public record LoginCommand(
    string Email,
    string Password
) : IRequest<AuthResponse>;

