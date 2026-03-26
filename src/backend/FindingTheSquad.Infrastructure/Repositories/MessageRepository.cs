using FindingTheSquad.Domain;
using FindingTheSquad.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FindingTheSquad.Infrastructure.Repositories;


public class MessageRepository : IMessageRepository
{
    private readonly AppDbContext _context;

    public MessageRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Message message)
    {
        await _context.Messages.AddAsync(message);
    }

    public async Task<List<Message>> GetConversationAsync(Guid userId, Guid otherId, Guid lfgSessionId)
    {
        return await _context.Messages
            .Where(m => m.LfgSessionId == lfgSessionId &&
                   ((m.SenderId == userId && m.ReceiverId == otherId) ||
                    (m.SenderId == otherId && m.ReceiverId == userId)))
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Message>> GetUnreadMessagesAsync(Guid userId)
    {
        return await _context.Messages
            .Where(m => m.ReceiverId == userId && !m.IsRead)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();
    }

    public async Task MarkAsReadAsync(Guid messageId)
    {
        var message = await _context.Messages.FindAsync(messageId);
        if (message != null)
        {
            message.MarkAsRead();
        }
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
}

