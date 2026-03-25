using MediatR;

namespace FindingTheSquad.Application.Auth.Queries;

public class GetAllUsersQuery : IRequest<List<UserDto>>
{
}

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

