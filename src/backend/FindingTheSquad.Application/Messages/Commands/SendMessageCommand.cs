using MediatR;

namespace FindingTheSquad.Application.Messages.Commands;

public record SendMessageCommand(
    Guid SenderId,
    Guid ReceiverId,
    Guid LfgSessionId,
    string Content
) : IRequest<SendMessageResponse>;

public class SendMessageResponse
{
    public Guid MessageId { get; set; }
    public DateTime CreatedAt { get; set; }
}

