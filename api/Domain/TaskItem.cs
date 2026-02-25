namespace TaskManagement.Domain
{
    public class TaskItem
    {
        public TaskItem(string title, string? description, DateTime dueDate)
        {
            Title = title;
            Description = description;
            Status = TaskStatus.Todo;
            DueDate = dueDate;
            CreatedAt = DateTime.UtcNow;
        }

        public int Id { get; private set; }
        public string Title { get; private set; }
        public string? Description { get; private set; }
        public TaskStatus Status { get; private set; }
        public DateTime DueDate { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? UpdatedAt { get; private set; }

        public void Update(string title, string? description, DateTime dueDate, TaskStatus status)
        {
            ValidateDueDate(dueDate);

            Title = title;
            Description = description;
            DueDate = dueDate;
            Status = status;
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
