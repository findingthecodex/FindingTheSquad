using MediatR;

namespace FindingTheSquad.Application.Auth.Commands;

public record DiscordLoginCommand(
    string Code,
    string State
) : IRequest<AuthResponse>;

