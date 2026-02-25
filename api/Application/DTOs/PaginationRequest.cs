namespace TaskManagement.Application.DTOs
{
    public record PaginationRequest(
        int PageNumber = 1,
        int PageSize = 10
    );
}
