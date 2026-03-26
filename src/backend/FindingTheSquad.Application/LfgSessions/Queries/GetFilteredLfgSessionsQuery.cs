using FindingTheSquad.Domain;
using MediatR;

namespace FindingTheSquad.Application.LfgSessions.Queries;

public record GetFilteredLfgSessionsQuery(
    string? GameTitle = null,
    string? Console = null
) : IRequest<List<LfgSession>>;

