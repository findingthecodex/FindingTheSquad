using FindingTheSquad.Domain.Interfaces;
using MediatR;

namespace FindingTheSquad.Application.Auth.Queries;

public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, List<UserDto>>
{
    private readonly IUserRepository _userRepository;

    public GetAllUsersHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await _userRepository.GetAllAsync();
        
        return users.Select(u => new UserDto
        {
            Id = u.Id,
            Email = u.Email,
            Username = u.Username,
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt
        }).ToList();
    }
}

