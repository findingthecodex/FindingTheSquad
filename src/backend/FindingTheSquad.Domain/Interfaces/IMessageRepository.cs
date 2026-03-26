using FindingTheSquad.Domain;

namespace FindingTheSquad.Domain.Interfaces;

public interface IMessageRepository
{
    Task AddAsync(Message message);
    Task<List<Message>> GetConversationAsync(Guid userId, Guid otherId, Guid lfgSessionId);
    Task<List<Message>> GetUnreadMessagesAsync(Guid userId);
    Task MarkAsReadAsync(Guid messageId);
    Task SaveAsync();
}

