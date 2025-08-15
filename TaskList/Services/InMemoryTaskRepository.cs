using TaskList.Models;

namespace TaskList.Services
{
    public sealed class InMemoryTaskRepository : ITaskRepository
    {
        private readonly List<TaskItem> _items = new(); //backing store
        private int _nextId = 1; // auto increment id
        private readonly object _lock = new(); // protects _items and _nextId

        public Task<List<TaskItem>> GetAllAsync()
        {
            lock (_lock) return Task.FromResult(_items.ToList());
        }

        public Task<TaskItem?> GetByIdAsync(int id)
        {
            lock(_lock) return Task.FromResult(_items.FirstOrDefault(t=> t.Id == id));
        }

        public Task<TaskItem> AddAsync(TaskItem item)
        {
            lock (_lock)
            {
                item.Id = _nextId++;
                _items.Add(item);
                return Task.FromResult(item);
            }
        }

        public Task<bool> MarkCompleteAsync(int id)
        {
            lock (_lock)
            {
                var task = _items.FirstOrDefault(t => t.Id == id);
                if (task is null) return Task.FromResult(false);
                task.IsComplete = true;
                return Task.FromResult(true);
            }
        }

        public Task<bool> DeleteAsync(int id)
        {
            lock(_lock)
            {
                var idx = _items.FindIndex(t => t.Id == id);
                if (idx < 0) return Task.FromResult(false);
                _items.RemoveAt(idx);
                return Task.FromResult(true);
            }
        }
    }
}
