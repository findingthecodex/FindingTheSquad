using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using FindingTheSquad.Application.Messages.Commands;
using FindingTheSquad.Application.Messages.Queries;
using FindingTheSquad.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FindingTheSquad.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly AppDbContext _context;

    public ChatController(IMediator mediator, AppDbContext context)
    {
        _mediator = mediator;
        _context = context;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageCommand command)
    {
        // Get the current user ID from token
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var parsedUserId))
        {
            return Unauthorized("User not authenticated");
        }

        // Create new command with SenderId from current user
        var updatedCommand = command with { SenderId = parsedUserId };
        
        Console.WriteLine($"💬 ChatController.SendMessage called:");
        Console.WriteLine($"   - SenderId: {parsedUserId}");
        Console.WriteLine($"   - ReceiverId: {updatedCommand.ReceiverId}");
        Console.WriteLine($"   - LfgSessionId: {updatedCommand.LfgSessionId}");
        Console.WriteLine($"   - Content: {updatedCommand.Content}");

        try
        {
            var result = await _mediator.Send(updatedCommand);
            Console.WriteLine($"✅ Message sent successfully, ID: {result.MessageId}");
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Failed to send message: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("conversation")]
    public async Task<IActionResult> GetConversation(
        [FromQuery] Guid otherUserId,
        [FromQuery] Guid lfgSessionId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var parsedUserId))
        {
            return Unauthorized("User not authenticated");
        }

        Console.WriteLine($"💬 ChatController.GetConversation called:");
        Console.WriteLine($"   - CurrentUserId: {parsedUserId}");
        Console.WriteLine($"   - OtherUserId: {otherUserId}");
        Console.WriteLine($"   - LfgSessionId: {lfgSessionId}");

        try
        {
            var query = new GetConversationQuery
            {
                UserId = parsedUserId,
                OtherUserId = otherUserId,
                LfgSessionId = lfgSessionId
            };

            var result = await _mediator.Send(query);
            
            Console.WriteLine($"✅ Found {result.Count} messages");
            
            // Enrich with usernames
            var userIds = result.Select(m => m.SenderId).Distinct().ToList();
            var users = await _context.Users
                .Where(u => userIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => u.Username);
            
            foreach (var message in result)
            {
                message.SenderUsername = users.ContainsKey(message.SenderId) 
                    ? users[message.SenderId] 
                    : "Unknown";
            }
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Failed to get conversation: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
    }
}

