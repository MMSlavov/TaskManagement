namespace TaskManagement.Application.DTOs
{
    public record ErrorResponse(
        string Message,
        string? Details = null,
        string? TraceId = null,
        int StatusCode = 500
    );
}
