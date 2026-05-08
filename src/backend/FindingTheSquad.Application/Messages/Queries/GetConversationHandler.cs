using MediatR;
using FindingTheSquad.Domain.Interfaces;

namespace FindingTheSquad.Application.Messages.Queries;

public class GetConversationHandler : IRequestHandler<GetConversationQuery, List<GetConversationResponse>>
{
    private readonly IMessageRepository _messageRepository;

    public GetConversationHandler(IMessageRepository messageRepository)
    {
        _messageRepository = messageRepository;
    }

    public async Task<List<GetConversationResponse>> Handle(GetConversationQuery request, CancellationToken cancellationToken)
    {
        var messages = await _messageRepository.GetConversationAsync(
            request.UserId,
            request.OtherUserId,
            request.LfgSessionId
        );

        // Return raw message data - controller will enrich with usernames
        return messages.Select(m => new GetConversationResponse
        {
            MessageId = m.Id,
            SenderId = m.SenderId,
            SenderUsername = "", // Will be filled by controller
            Content = m.Content,
            CreatedAt = m.CreatedAt,
            IsRead = m.IsRead
        }).ToList();
    }
}

