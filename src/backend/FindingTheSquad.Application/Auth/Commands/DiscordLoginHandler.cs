using FindingTheSquad.Domain;
using FindingTheSquad.Domain.Interfaces;
using MediatR;
using System.Text.Json;

namespace FindingTheSquad.Application.Auth.Commands;

public class DiscordLoginHandler : IRequestHandler<DiscordLoginCommand, AuthResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly DiscordOAuthOptions _discordOptions;
    private readonly HttpClient _httpClient;

    public DiscordLoginHandler(IUserRepository userRepository, ITokenService tokenService, DiscordOAuthOptions discordOptions, HttpClient httpClient)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _discordOptions = discordOptions;
        _httpClient = httpClient;
    }

    public async Task<AuthResponse> Handle(DiscordLoginCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(_discordOptions.ClientId) || string.IsNullOrEmpty(_discordOptions.ClientSecret))
            throw new InvalidOperationException("Discord credentials not configured");

        // Exchange code for access token
        var tokenResponse = await ExchangeCodeForToken(_discordOptions.ClientId, _discordOptions.ClientSecret, _discordOptions.RedirectUri, request.Code);
        var accessToken = tokenResponse.GetProperty("access_token").GetString();

        if (string.IsNullOrEmpty(accessToken))
            throw new UnauthorizedAccessException("Failed to get Discord access token");

        // Get user info from Discord
        var discordUser = await GetDiscordUserInfo(accessToken);
        var discordId = discordUser.GetProperty("id").GetString();
        var email = discordUser.GetProperty("email").GetString();
        var username = discordUser.GetProperty("username").GetString();
        var avatar = discordUser.TryGetProperty("avatar", out var avatarElement) ? avatarElement.GetString() : null;

        if (string.IsNullOrEmpty(discordId) || string.IsNullOrEmpty(email))
            throw new InvalidOperationException("Invalid Discord user data");

        // Check if user exists by Discord ID
        var existingUser = await _userRepository.GetByDiscordIdAsync(discordId);

        if (existingUser != null && existingUser.IsActive)
        {
            // Update Discord info if needed
            existingUser.UpdateDiscordInfo(discordId, username ?? "", avatar ?? "");
            await _userRepository.UpdateAsync(existingUser);
            await _userRepository.SaveChangesAsync();

            var token = _tokenService.GenerateToken(existingUser);
            return new AuthResponse(existingUser.Id, existingUser.Email, existingUser.Username, token);
        }

        // Check if user exists by email
        var userByEmail = await _userRepository.GetByEmailAsync(email);
        if (userByEmail != null && userByEmail.IsActive)
        {
            // Link Discord account to existing user
            userByEmail.UpdateDiscordInfo(discordId, username ?? "", avatar ?? "");
            await _userRepository.UpdateAsync(userByEmail);
            await _userRepository.SaveChangesAsync();

            var token = _tokenService.GenerateToken(userByEmail);
            return new AuthResponse(userByEmail.Id, userByEmail.Email, userByEmail.Username, token);
        }

        // Create new user
        var newUser = new User(email, username ?? "DiscordUser", discordId, username, avatar);
        await _userRepository.AddAsync(newUser);
        await _userRepository.SaveChangesAsync();

        var newToken = _tokenService.GenerateToken(newUser);
        return new AuthResponse(newUser.Id, newUser.Email, newUser.Username, newToken);
    }

    private async Task<JsonElement> ExchangeCodeForToken(string clientId, string clientSecret, string redirectUri, string code)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "https://discord.com/api/oauth2/token");
        request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            { "client_id", clientId },
            { "client_secret", clientSecret },
            { "grant_type", "authorization_code" },
            { "code", code },
            { "redirect_uri", redirectUri },
            { "scope", "identify email" }
        });

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<JsonElement>(content);
    }

    private async Task<JsonElement> GetDiscordUserInfo(string accessToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "https://discord.com/api/users/@me");
        request.Headers.Add("Authorization", $"Bearer {accessToken}");

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<JsonElement>(content);
    }
}

public class DiscordOAuthOptions
{
    public string ClientId { get; set; } = "";
    public string ClientSecret { get; set; } = "";
    public string RedirectUri { get; set; } = "";
}



