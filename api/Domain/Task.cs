namespace TaskManagement.Domain
{
    public enum TaskStatus
    {
        Todo = 0,
        InProgress = 1,
        Done = 2
    }

    public class TaskItem
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public TaskStatus Status { get; set; } = TaskStatus.Todo;
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public void Update(string title, string? description, DateTime? dueDate, TaskStatus status)
        {
            ValidateDueDate(dueDate);

            Title = title;
            Description = description;
            DueDate = dueDate;
            Status = status;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateStatus(TaskStatus status)
        {
            Status = status;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateDueDate(DateTime? dueDate)
        {
            ValidateDueDate(dueDate);
            DueDate = dueDate;
            UpdatedAt = DateTime.UtcNow;
        }

        private static void ValidateDueDate(DateTime? dueDate)
        {
            if (dueDate.HasValue && dueDate.Value.Date < DateTime.UtcNow.Date)
            {
                throw new ArgumentException("Due date cannot be in the past.", nameof(dueDate));
            }
        }
    }
}
