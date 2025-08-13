using TaskList.Models;

namespace TaskList.Services
{
    public interface ITaskRepository
    {
        Task<List<TaskItem>> GetAllAsync();
        Task<TaskItem?> GetByIdAsync(int id);
        Task<TaskItem> AddAsync(TaskItem item);
        Task<bool> MarkCompleteAsync(int id);
    }
}
