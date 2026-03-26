using MediatR;

namespace FindingTheSquad.Application.LfgSessions.Commands;

public record CreateLfgSessionCommand(
    string PlayerName,
    string GameTitle,
    string DiscordTag,
    string Description,
    string Console
) : IRequest<Guid>;