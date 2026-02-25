using System.ComponentModel.DataAnnotations;

namespace TaskManagement.Application.DTOs
{
    public record CreateTaskDto(
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(200, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 200 characters.")]
        string Title,
        
        [DataType(DataType.DateTime)]
        DateTime DueDate,
        
        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
        string? Description = null
    );
}
