using TaskManagement.Domain;

namespace TaskManagement.Application.DTOs
{
    public record TaskItemDto(
        int Id,
        string Title,
        string? Description,
        Domain.TaskStatus Status,
        DateTime? DueDate,
        DateTime CreatedAt,
        DateTime? UpdatedAt
    );
}
