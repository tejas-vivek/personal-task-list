'use client'

import { useState, useEffect, useCallback, useMemo } from "react";

// ---Types---
export type TaskItem = {
  id: number
  title: string
  description?: string | null
  isComplete: boolean
  createdAt: string
}

export type CreateTaskDto = {
  title: string
  description?: string
}

//---API helpers---
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://localhost:44320'
const ENDPOINTS = {
  list: () => `${API_BASE}/api/tasks`,
  add: () => `${API_BASE}/api/tasks`,
  complete: (id: number) => `${API_BASE}/api/tasks/${id}/complete`,
  delete: (id:number) => `${API_BASE}/api/tasks/${id}`
}

// sorting incomplete tasks on top
const sortTasks = (arr: TaskItem[]) => 
[...arr].sort((a,b) => {
  if(a.isComplete !== b.isComplete) return a.isComplete ? 1 : -1 //first show incomplete
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // newest first
})

// ---custom hook---
function useTasks(){
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null> (null)

  //To keep UI consistent with backend
  const refetch = useCallback(async() => {
    setLoading(true)
    setError(null)
    try{
      const res = await fetch(ENDPOINTS.list())
      if(!res.ok) throw new Error(`GET /api/tasks failed ($(res.status))`)
      const data: TaskItem[] = await res.json()
      setTasks(sortTasks(data))
    } catch (err: any){
      setError(err?.message ?? 'Failed to load tasks')
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  // POST to backend 
  const addTask = useCallback(
    async (dto: CreateTaskDto) => {
      const res = await fetch(ENDPOINTS.add(), {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(dto),
      })
      if(!res.ok) throw new Error(`POST /api/tasks failed (${res.status})`)
        await refetch() // refetch after mutation
    }, [refetch])

    // Modify the task to have a strikethrough
    const completeTask = useCallback(
    async (id: number) => {
    const res = await fetch(ENDPOINTS.complete(id), {method: 'PATCH'})
    if(!res.ok) throw new Error(`PATCH /api/tasks/${id}/complete failed (${res.status})`)
    await refetch()
    }, [refetch])

    const deleteTask = useCallback(
      async(id: number) => {
        const res = await fetch(ENDPOINTS.delete(id), {method: 'DELETE'})
        if(!res.ok) throw new Error(`DELETE /api/tasks/${id} failed (${res.status})`)
        await refetch()
      }, [refetch])

    return {tasks, loading, error, refetch, addTask, completeTask, deleteTask}
}


export default function Home() {

  const {tasks, loading, error, addTask, completeTask, deleteTask} = useTasks()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false);
  const [completingId, setCompletingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    if(!title.trim()) return 
    setSubmitting(true)
    try{
      await addTask({title: title.trim(), description: description.trim() || undefined}) // calls addTask function in custom hook
      setTitle('')
      setDescription('')
    } catch(err) {
      alert('Failed to add task. Try again')
    } finally {
      setSubmitting(false)
    }
  }

  async function onComplete(id: number){
    setCompletingId(id)
    try{
      await completeTask(id)
    } catch (err){
      alert('Failed to mark complete')
    } finally {
      setCompletingId(null)
    }
  }

  async function onDelete(id: number){
    if(!confirm('Delete this task?')) return
    setDeletingId(id)
    try{
      await deleteTask(id)
    } catch {
      alert('Failed to delete. Try again')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold text-slate-900">Personal Task List</h1>

        {/* Left and Right Half */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left part: Form */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-medium text-slate-800">Add a task</h2>
              <form onSubmit={onSubmit} className="space-y-3">
                {/* Title input field */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none ring-0 focus:border-slate-400 text-slate-800"
                    placeholder="Add task"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={200}
                    required
                  />
                </div>

                {/* Description input field */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="desc">
                    Description <span className="text-slate-400">(optional)</span>
                  </label>
                  <textarea 
                    id="desc"
                    className="min-h-[84px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-400 text-slate-800"
                    placeholder="task description"
                    value={description}
                    onChange={e=> setDescription(e.target.value)}
                    maxLength={2000}
                  />
                </div>

                <button
                  type="submit"
                  disabled= {submitting || !title.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />}
                  Add Task
                </button>
              </form>
            </section>

          {/* Right part: List */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-800">Your tasks</h2>
            </div>

            {/* loading state*/}
            {loading && (
              <div className="flex items-center gap-2 text-slate-600">
                <span className="h-4 w-4 rounded-full border-2 border-slate-400/70 border-t-transparent">Loading...</span>
              </div>
            )}

            {/* show error */}
            {error && (
              <div role="alert" className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <ul className="space-y-3">
              {tasks.map(t => (
                <li key={t.id} className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={t.isComplete ? 'line-through text-slate-500' : 'text-slate-900'}>{t.title}</span>
                      {t.isComplete && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Completed</span>
                      )}
                    </div>
                    {t.description && (
                      <p className="mt-1 text-sm text-slate-600 break-words">{t.description}</p>
                    )}
                    <time title={new Date(t.createdAt).toLocaleString()} className="mt-1 block text-xs text-slate-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </time>
                  </div>

                  {/* Button to mark complete */}
                  <div className="shrink-0">
                    {!t.isComplete && (
                      <button
                        onClick={() => onComplete(t.id)}
                        disabled = {completingId === t.id}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {completingId === t.id ? 'Completing...' : 'Mark Complete'}
                      </button>
                    )}
                  </div>

                  <div className="shrink-0">
                    <button
                    onClick={()=> onDelete(t.id)}
                    disabled = {deletingId === t.id}
                    className="ml-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === t.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>


            {/* If no tasks exists */}
            {!loading && tasks.length === 0 && !error && (
              <p className="text-sm text-slate-600">No tasks yet. Add your first task from the form!</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
function deleteTask(id: number) {
  throw new Error("Function not implemented.");
}

