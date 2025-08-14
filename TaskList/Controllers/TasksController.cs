using Microsoft.AspNetCore.Mvc;
using TaskList.Dtos;
using TaskList.Models;
using TaskList.Services;

namespace TaskList.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskRepository _repo;
        private readonly ILogger<TasksController> _logger;

        public TasksController(ITaskRepository repo, ILogger<TasksController> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        //Get all tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetAll()
        {
            var items = await _repo.GetAllAsync();
            return Ok(items);
        }

        // (Optional) GET by id
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TaskItem>> GetById(int id)
        {
            var item = await _repo.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        //POST add a task
        [HttpPost]
        public async Task<ActionResult<TaskItem>> Create([FromBody] CreateTaskDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            var toAdd = new TaskItem
            {
                Title = dto.Title,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _repo.AddAsync(toAdd);
            _logger.LogInformation("Task added: {TaskId} - {Title}", created.Id, created.Title);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        //PATCH mark complete
        [HttpPatch("{id:int}/complete")]
        public async Task<IActionResult> MarkComplete(int id)
        {
            var ok = await _repo.MarkCompleteAsync(id);

            if (ok)
            {
                _logger.LogInformation("Task marked as complete: {TaskId}", id);
            } else
            {
                _logger.LogWarning("Attempted to mark task not present as complete: {TaskId}", id);
            }
                return ok ? NoContent() : NoContent();
        }
    }
}
