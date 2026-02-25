using TaskManagement.Application.DTOs;

namespace TaskManagement.Application.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskItemDto>> GetTasksAsync(Domain.TaskStatus? status = null);
        Task<TaskItemDto?> GetTaskByIdAsync(int id);
        Task<TaskItemDto> CreateTaskAsync(CreateTaskDto createTaskDto);
        Task<TaskItemDto?> UpdateTaskAsync(int id, UpdateTaskDto updateTaskDto);
        Task<bool> DeleteTaskAsync(int id);
    }
}
