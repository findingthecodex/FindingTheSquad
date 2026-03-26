using FindingTheSquad.Application.LfgSessions.Queries;
using FindingTheSquad.Application.LfgSessions.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FindingTheSquad.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LfgController : ControllerBase
{
    private readonly IMediator _mediator;

    public LfgController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateLfgSessionCommand command)
    {
        // Get the current user ID from token
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var parsedUserId))
        {
            return Unauthorized("User not authenticated");
        }

        // Add UserId to command
        command = command with { UserId = parsedUserId };
        
        var id = await _mediator.Send(command);
        return Ok(id);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var sessions = await _mediator.Send(new GetLfgSessionsQuery());
        return Ok(sessions);
    }

    [HttpGet("filter")]
    public async Task<IActionResult> GetFiltered([FromQuery] string? gameTitle, [FromQuery] string? console)
    {
        var sessions = await _mediator.Send(new GetFilteredLfgSessionsQuery(gameTitle, console));
        return Ok(sessions);
    }
}