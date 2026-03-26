using FindingTheSquad.Domain;
using FindingTheSquad.Domain.Interfaces;
using MediatR;

namespace FindingTheSquad.Application.LfgSessions.Queries;

public class GetFilteredLfgSessionsHandler : IRequestHandler<GetFilteredLfgSessionsQuery, List<LfgSession>>
{
    private readonly ILfgRepository _repository;

    public GetFilteredLfgSessionsHandler(ILfgRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<LfgSession>> Handle(GetFilteredLfgSessionsQuery request, CancellationToken cancellationToken)
    {
        var sessions = (await _repository.GetAllActiveAsync()).AsEnumerable();
        
        if (!string.IsNullOrEmpty(request.GameTitle))
        {
            sessions = sessions.Where(s => s.GameTitle.Equals(request.GameTitle, StringComparison.OrdinalIgnoreCase));
        }
        
        if (!string.IsNullOrEmpty(request.Console))
        {
            sessions = sessions.Where(s => s.Console.Equals(request.Console, StringComparison.OrdinalIgnoreCase));
        }
        
        return sessions.ToList();
    }
}

