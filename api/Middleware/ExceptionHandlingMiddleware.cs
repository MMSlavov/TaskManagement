using System.Net;
using TaskManagement.Application.DTOs;

namespace TaskManagement.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            _logger.LogError(exception, "An unhandled exception occurred: {Message}", exception.Message);

            context.Response.ContentType = "application/json";

            var (statusCode, message, details) = GetExceptionDetails(exception);
            context.Response.StatusCode = (int)statusCode;

            var errorResponse = new ErrorResponse(
                Message: message,
                Details: details,
                TraceId: context.TraceIdentifier,
                StatusCode: (int)statusCode
            );

            return context.Response.WriteAsJsonAsync(errorResponse);
        }

        private static (HttpStatusCode StatusCode, string Message, string? Details) GetExceptionDetails(Exception exception)
        {
            return exception switch
            {
                ArgumentNullException nullEx => (
                    HttpStatusCode.BadRequest,
                    "Required argument is null.",
                    nullEx.ParamName
                ),
                ArgumentException argEx => (
                    HttpStatusCode.BadRequest,
                    "Invalid argument provided.",
                    argEx.Message
                ),
                InvalidOperationException invOpEx => (
                    HttpStatusCode.BadRequest,
                    "Invalid operation.",
                    invOpEx.Message
                ),
                KeyNotFoundException keyEx => (
                    HttpStatusCode.NotFound,
                    "Resource not found.",
                    keyEx.Message
                ),
                _ => (
                    HttpStatusCode.InternalServerError,
                    "An unexpected error occurred. Please try again later.",
                    exception.Message
                )
            };
        }
    }

    public static class ExceptionHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseExceptionHandling(this IApplicationBuilder app)
        {
            return app.UseMiddleware<ExceptionHandlingMiddleware>();
        }
    }
}
