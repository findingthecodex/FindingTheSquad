using FindingTheSquad.Domain;
using FindingTheSquad.Domain.Interfaces;
using MediatR;

namespace FindingTheSquad.Application.LfgSessions.Commands;

public class CreateLfgSessionHandler : IRequestHandler<CreateLfgSessionCommand, Guid>
{
    private readonly ILfgRepository _repository;

    public CreateLfgSessionHandler(ILfgRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> Handle(CreateLfgSessionCommand request, CancellationToken cancellationToken)
    {
        var session = new LfgSession(
            request.PlayerName,
            request.GameTitle,
            request.DiscordTag,
            request.Description,
            request.Console
        );

        await _repository.AddAsync(session);
        await _repository.SaveChangesAsync();
        return session.Id;
    }
}