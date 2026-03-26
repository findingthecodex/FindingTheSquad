using MediatR;
using FindingTheSquad.Domain;
using FindingTheSquad.Domain.Interfaces;

namespace FindingTheSquad.Application.Messages.Commands;

public class SendMessageHandler : IRequestHandler<SendMessageCommand, SendMessageResponse>
{
    private readonly IMessageRepository _messageRepository;

    public SendMessageHandler(IMessageRepository messageRepository)
    {
        _messageRepository = messageRepository;
    }

    public async Task<SendMessageResponse> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        Console.WriteLine($"💾 SendMessageHandler.Handle called:");
        Console.WriteLine($"   - SenderId: {request.SenderId}");
        Console.WriteLine($"   - ReceiverId: {request.ReceiverId}");
        Console.WriteLine($"   - LfgSessionId: {request.LfgSessionId}");
        Console.WriteLine($"   - Content: {request.Content}");
        
        var message = new Message(
            request.SenderId,
            request.ReceiverId,
            request.LfgSessionId,
            request.Content
        );

        Console.WriteLine($"📝 Created Message object with ID: {message.Id}");
        
        await _messageRepository.AddAsync(message);
        Console.WriteLine($"✅ Message added to repository");
        
        await _messageRepository.SaveAsync();
        Console.WriteLine($"💾 Message saved to database!");

        return new SendMessageResponse
        {
            MessageId = message.Id,
            CreatedAt = message.CreatedAt
        };
    }
}

