# Personal Task List

A full stack app with an ASP.NET Core Web API backend and a Next.js + Tailwind frontend. Add new tasks, list them and mark them complete. Frontend state lives in-memory (react) and the app uses a simple "refetch after mutation" pattern.

## Stack

### Backend

ASP.NET Core Web API (C#)

Repository pattern (in‑memory repo by default; optional EF Core + SQLite)

DTOs for input validation (CreateTaskDto)

CORS enabled for local dev

### Frontend

Next.js (App Router) + React + TypeScript

Tailwind CSS for styling

Custom useTasks() hook (fetch, add, complete, and refetch)


## Prerequistes

.NET 8 SDK (or the SDK targeted by your project)

Node.js 18+ and npm


## Stack Used

# Backend - Run

1. From `/TaskList` :

```
#restore & run
dotnet restore
dotnet run
```

2. Check `Properties/launchSettings.json` for the ports, e.g.:
```
https://localhost:44320  (IIS Express)
```

3. Dev HTTPS certificate (if needed):
```
dotnet dev-certs https --trust
```

#Frontend - Run

1. From `/client`
```
npm install
npm run dev
```

2. Configure the backend base URL in `/client/.env.local` :
```
NEXT_PUBLIC_API_BASE = https://localhost:44320
```
Use whatever port your backend prints at startup

3. Open the app on http://localhost:3000

## What I'd Improve
### Persist data with EF Core + SQLite DB
Move from in-memory to persistent DB to store tasks.

### TanStack Query for data-fetching and caching
Replace the custom hook’s manual refetch with query/mutation hooks, cache invalidation, retries, and better loading states.

### Add Edit endpoint
Add a `PUT /api/tasks/{id}` endpoint to allow editing

### Validation & Error
Backend: FluentValidation or data annotations with consistent error payloads
Frontend: inline errors on the form


