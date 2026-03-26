namespace FindingTheSquad.Domain;

public class Message
{
    public Guid Id { get; private set; }
    public Guid SenderId { get; private set; }
    public Guid ReceiverId { get; private set; }
    public Guid LfgSessionId { get; private set; }
    public string Content { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public bool IsRead { get; private set; }

    private Message() { }

    public Message(Guid senderId, Guid receiverId, Guid lfgSessionId, string content)
    {
        Id = Guid.NewGuid();
        SenderId = senderId;
        ReceiverId = receiverId;
        LfgSessionId = lfgSessionId;
        Content = content;
        CreatedAt = DateTime.UtcNow;
        IsRead = false;
    }

    public void MarkAsRead()
    {
        IsRead = true;
    }
}

