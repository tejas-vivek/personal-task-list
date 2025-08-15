using Microsoft.AspNetCore.Authentication.OAuth.Claims;
using TaskList.Models;

namespace TaskList.Services
{
    public interface ITaskRepository
    {
        Task<List<TaskItem>> GetAllAsync(); //Return all tasks
        Task<TaskItem?> GetByIdAsync(int id); //Return a task by id or null if not found
        Task<TaskItem> AddAsync(TaskItem item); //Add a new task and return the creatd entity
        Task<bool> MarkCompleteAsync(int id); //Mark an task complete, return false if id doesn't exist
        Task<bool> DeleteAsync(int id); //Delete a task
    }
}
