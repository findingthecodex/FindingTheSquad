using MediatR;

namespace FindingTheSquad.Application.Messages.Queries;

public class GetConversationQuery : IRequest<List<GetConversationResponse>>
{
    public Guid UserId { get; set; }
    public Guid OtherUserId { get; set; }
    public Guid LfgSessionId { get; set; }
}

public class GetConversationResponse
{
    public Guid MessageId { get; set; }
    public Guid SenderId { get; set; }
    public string SenderUsername { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
}

