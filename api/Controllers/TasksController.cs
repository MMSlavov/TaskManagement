using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.DTOs;
using TaskManagement.Application.Services;

namespace TaskManagement.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResponse<TaskItemDto>>> GetTasks(
            [FromQuery] Domain.TaskStatus? status = null,
            [FromQuery] int pageIndex = 1,
            [FromQuery] int pageSize = 10)
        {
            if (pageIndex < 1)
                return BadRequest(new { message = "Page number must be at least 1." });
            
            if (pageSize < 1 || pageSize > 100)
                return BadRequest(new { message = "Page size must be between 1 and 100." });

            var pagedTasks = await _taskService.GetTasksAsync(status, pageIndex, pageSize);

            return Ok(pagedTasks);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItemDto>> GetTask(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task is null)
                return NotFound(new { message = $"Task with ID {id} not found." });

            return Ok(task);
        }

        [HttpPost]
        public async Task<ActionResult<TaskItemDto>> CreateTask([FromBody] CreateTaskDto createTaskDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdTask = await _taskService.CreateTaskAsync(createTaskDto);

            return CreatedAtAction(nameof(GetTask), new { id = createdTask.Id }, createdTask);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TaskItemDto>> UpdateTask(int id, [FromBody] UpdateTaskDto updateTaskDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedTask = await _taskService.UpdateTaskAsync(id, updateTaskDto);
            if (updatedTask is null)
                return NotFound(new { message = $"Task with ID {id} not found." });

            return Ok(updatedTask);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var deleted = await _taskService.DeleteTaskAsync(id);
            if (!deleted)
                return NotFound(new { message = $"Task with ID {id} not found." });

            return NoContent();
        }
    }
}
