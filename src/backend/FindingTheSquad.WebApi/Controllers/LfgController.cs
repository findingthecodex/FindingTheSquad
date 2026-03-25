using FindingTheSquad.Domain;
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
}