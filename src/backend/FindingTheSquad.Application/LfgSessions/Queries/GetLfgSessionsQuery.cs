using FindingTheSquad.Domain;
using MediatR;

namespace FindingTheSquad.Application.LfgSessions.Queries;

// Denna post representerar själva frågan: "Ge mig alla sessioner"
public record GetLfgSessionsQuery() : IRequest<List<LfgSession>>;