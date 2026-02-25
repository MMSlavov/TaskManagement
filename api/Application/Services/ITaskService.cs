using TaskManagement.Application.DTOs;
using TaskManagement.Domain;

namespace TaskManagement.Application.Services
{
    public interface ITaskService
    {
        Task<PagedResponse<TaskItemDto>> GetTasksAsync(Domain.TaskStatus? status = null, int pageIndex = 1, int pageSize = 10);
        Task<TaskItemDto?> GetTaskByIdAsync(int id);
        Task<TaskItemDto> CreateTaskAsync(CreateTaskDto createTaskDto);
        Task<TaskItemDto?> UpdateTaskAsync(int id, UpdateTaskDto updateTaskDto);
        Task<bool> DeleteTaskAsync(int id);
    }
}
