using System.ComponentModel.DataAnnotations;
using TaskManagement.Domain;

namespace TaskManagement.Application.DTOs
{
    public record UpdateTaskDto(
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(200, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 200 characters.")]
        string Title,
        
        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
        string? Description = null,
        
        [DataType(DataType.DateTime)]
        DateTime? DueDate = null,
        
        [EnumDataType(typeof(Domain.TaskStatus), ErrorMessage = "Invalid status value.")]
        Domain.TaskStatus Status = Domain.TaskStatus.Todo
    );
}
