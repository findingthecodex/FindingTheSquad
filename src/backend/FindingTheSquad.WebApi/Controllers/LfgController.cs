using FindingTheSquad.Application.LfgSessions.Queries;
using FindingTheSquad.Application.LfgSessions.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

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
    public async Task<IActionResult> Create(CreateLfgSessionCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(id);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var sessions = await _mediator.Send(new GetLfgSessionsQuery());
        return Ok(sessions);
    }
}