using System.ComponentModel.DataAnnotations;

namespace TaskList.Dtos
{
    // payload accepted by POST api/tasks
    public class CreateTaskDto
    {
        public string Title { get; init; } = string.Empty; //init-only to keep immutable semantics from the controller

        public string? Description { get; init; }
    }
}
