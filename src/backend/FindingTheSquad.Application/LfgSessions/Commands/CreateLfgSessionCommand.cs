using MediatR;

namespace FindingTheSquad.Application.LfgSessions.Commands;

public record CreateLfgSessionCommand(
    Guid UserId,
    string PlayerName,
    string GameTitle,
    string DiscordTag,
    string Description,
    string Console
) : IRequest<Guid>;