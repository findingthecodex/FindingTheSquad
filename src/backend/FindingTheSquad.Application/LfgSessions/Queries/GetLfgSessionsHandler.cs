using FindingTheSquad.Domain;
using FindingTheSquad.Domain.Interfaces;
using MediatR;

namespace FindingTheSquad.Application.LfgSessions.Queries;

public class GetLfgSessionsHandler : IRequestHandler<GetLfgSessionsQuery, List<LfgSession>>
{
    private readonly ILfgRepository _repository;

    public GetLfgSessionsHandler(ILfgRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<LfgSession>> Handle(GetLfgSessionsQuery request, CancellationToken cancellationToken)
    {
        return (await _repository.GetAllActiveAsync()).ToList();
    }
}