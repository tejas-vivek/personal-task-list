using System.ComponentModel.DataAnnotations;

namespace TaskList.Dtos
{
    public class CreateTaskDto
    {
        public string Title { get; init; } = string.Empty;

        public string? Description { get; init; }
    }
}
