using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.DTOs;
using TaskManagement.Domain;
using TaskManagement.Infrastructure;

namespace TaskManagement.Application.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _dbContext;

        public TaskService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<TaskItemDto?> GetTaskByIdAsync(int id)
        {
            var task = await _dbContext.Tasks
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);

            return task is null ? null : MapToDto(task);
        }

        public async Task<PagedResponse<TaskItemDto>> GetTasksAsync(Domain.TaskStatus? status = null, int pageIndex = 1, int pageSize = 10)
        {
            var query = _dbContext.Tasks.AsNoTracking();

            if (status.HasValue)
                query = query.Where(t => t.Status == status);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var tasks = await query
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .Select(t => MapToDto(t))
                .ToListAsync();

            return new PagedResponse<TaskItemDto>(
                Items: tasks,
                PageIndex: pageIndex,
                PageSize: pageSize,
                TotalCount: totalCount,
                TotalPages: totalPages
            );
        }

        public async Task<TaskItemDto> CreateTaskAsync(CreateTaskDto createTaskDto)
        {
            var task = new TaskItem(createTaskDto.Title, createTaskDto.Description, createTaskDto.DueDate);

            _dbContext.Tasks.Add(task);
            await _dbContext.SaveChangesAsync();

            return MapToDto(task);
        }

        public async Task<TaskItemDto?> UpdateTaskAsync(int id, UpdateTaskDto updateTaskDto)
        {
            var task = await _dbContext.Tasks.FirstOrDefaultAsync(t => t.Id == id);
            if (task is null)
                return null;

            task.Update(updateTaskDto.Title, updateTaskDto.Description, updateTaskDto.DueDate, updateTaskDto.Status);
            await _dbContext.SaveChangesAsync();

            return MapToDto(task);
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _dbContext.Tasks.FirstOrDefaultAsync(t => t.Id == id);
            if (task is null)
                return false;

            _dbContext.Tasks.Remove(task);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        private static TaskItemDto MapToDto(TaskItem task)
        {
            return new TaskItemDto(
                task.Id,
                task.Title,
                task.Description,
                task.Status.ToString(),
                task.DueDate,
                task.CreatedAt,
                task.UpdatedAt
            );
        }
    }
}
