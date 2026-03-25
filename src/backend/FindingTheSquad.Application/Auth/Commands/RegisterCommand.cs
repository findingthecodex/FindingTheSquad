using MediatR;

namespace FindingTheSquad.Application.Auth.Commands;

public record RegisterCommand(
    string Email,
    string Username,
    string Password
) : IRequest<AuthResponse>;

public record AuthResponse(
    Guid UserId,
    string Email,
    string Username,
    string Token
);

