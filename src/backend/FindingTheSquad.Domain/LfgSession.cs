namespace FindingTheSquad.Domain;

public class LfgSession
{
    // Unikt ID för varje annons
    public Guid Id { get; private set; }
    
    // Vem är spelaren?
    public string PlayerName { get; private set; } = string.Empty;
    
    // Vilket spel gäller det?
    public string GameTitle { get; private set; } = string.Empty;
    
    // Hur når man personen?
    public string DiscordTag { get; private set; } = string.Empty;
    
    // Beskrivning, t.ex. "Letar efter 2 stycken för rankad play"
    public string Description { get; private set; } = string.Empty;
    
    public DateTime CreatedAt { get; private set; }
    public bool IsActive { get; private set; }

    // Privat konstruktor för att Entity Framework ska vara glad senare
    private LfgSession() { }

    // Vår "riktiga" konstruktor som vi använder när vi skapar en ny session
    public LfgSession(string playerName, string gameTitle, string discordTag, string description)
    {
        Id = Guid.NewGuid();
        PlayerName = playerName;
        GameTitle = gameTitle;
        DiscordTag = discordTag;
        Description = description;
        CreatedAt = DateTime.UtcNow;
        IsActive = true;
    }

    // En enkel metod för att stänga sessionen när gruppen är full
    public void Complete() 
    {
        IsActive = false;
    }
}