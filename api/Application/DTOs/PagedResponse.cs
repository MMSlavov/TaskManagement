namespace TaskManagement.Application.DTOs
{
    public record PagedResponse<T>(
        IEnumerable<T> Items,
        int PageIndex,
        int PageSize,
        int TotalCount,
        int TotalPages
    )
    {
        public bool HasPreviousPage => PageIndex > 1;
        public bool HasNextPage => PageIndex < TotalPages;
    }
}
