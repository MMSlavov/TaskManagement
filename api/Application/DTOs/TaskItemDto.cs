namespace TaskManagement.Application.DTOs
{
    public record TaskItemDto(
        int Id,
        string Title,
        string? Description,
        string Status,
        DateTime DueDate,
        DateTime CreatedAt,
        DateTime? UpdatedAt
    );
}
