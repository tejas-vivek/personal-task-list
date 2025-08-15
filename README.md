# personal-task-list

A full stack app with an ASP.NET Core Web API backend and a Next.js + Tailwind frontend. Add new tasks, list them and mark them complete. Frontend state lives in-memory (react) and the app uses a simple "refetch after mutation" pattern.

Stack

Backend

ASP.NET Core Web API (C#)

Repository pattern (in‑memory repo by default; optional EF Core + SQLite)

DTOs for input validation (CreateTaskDto)

CORS enabled for local dev

Frontend

Next.js (App Router) + React + TypeScript

Tailwind CSS for styling

Custom useTasks() hook (fetch, add, complete, and refetch)