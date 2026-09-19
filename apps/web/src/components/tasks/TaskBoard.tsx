"use client"

import type { FormEvent, ReactNode } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "CANCELLED"
type TaskPriority = "NO_PRIORITY" | "URGENT" | "HIGH" | "MEDIUM" | "LOW"

type Task = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  assignee: { id: string; name: string | null; image: string | null } | null
  createdBy: { id: string; name: string | null }
  dueDate: Date | null
  createdAt: Date
}

type Member = { id: string; name: string | null; image: string | null }

type Props = {
  workspaceSlug: string
  initialTasks: Task[]
  members: Member[]
  currentUserId: string
}

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: "BACKLOG", label: "Backlog", color: "text-white/30" },
  { status: "TODO", label: "Todo", color: "text-white/50" },
  { status: "IN_PROGRESS", label: "In Progress", color: "text-blue-400" },
  { status: "IN_REVIEW", label: "In Review", color: "text-yellow-400" },
  { status: "DONE", label: "Done", color: "text-success" },
  { status: "CANCELLED", label: "Cancelled", color: "text-red-400" },
]

const PRIORITY_ICONS: Record<TaskPriority, ReactNode> = {
  NO_PRIORITY: <span className="text-white/20">—</span>,
  URGENT: <span className="text-red-400 text-xs font-bold">!</span>,
  HIGH: <span className="text-orange-400">↑</span>,
  MEDIUM: <span className="text-yellow-400">→</span>,
  LOW: <span className="text-blue-400">↓</span>,
}

export default function TaskBoard({ workspaceSlug, initialTasks, members, currentUserId }: Props) {
  const router = useRouter()
  const [tasks, setTasks] = useState(initialTasks)
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newStatus, setNewStatus] = useState<TaskStatus>("TODO")
  const [newPriority, setNewPriority] = useState<TaskPriority>("NO_PRIORITY")
  const [newAssignee, setNewAssignee] = useState("")
  const [creating, setCreating] = useState(false)

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setCreating(true)
    const res = await fetch(`/api/workspaces/${workspaceSlug}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle.trim(),
        status: newStatus,
        priority: newPriority,
        assigneeId: newAssignee || undefined,
      }),
    })
    if (res.ok) {
      const task = await res.json()
      setTasks((t) => [task, ...t])
      setNewTitle("")
      setShowCreate(false)
      router.refresh()
    }
    setCreating(false)
  }

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    setTasks((t) => t.map((task) => (task.id === taskId ? { ...task, status } : task)))
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    router.refresh()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-white/8">
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 rounded-full bg-purple-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-600 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          New task
        </button>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#111] p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-semibold">New task</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Task title"
                required
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-white/40">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TaskStatus)}
                    className="w-full rounded-xl border border-white/10 bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.status} value={c.status}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/40">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full rounded-xl border border-white/10 bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
                  >
                    <option value="NO_PRIORITY">No priority</option>
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/40">Assignee</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTitle.trim()}
                  className="flex-1 rounded-full bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600 disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Board columns */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex h-full gap-px min-w-max">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.status)
            return (
              <div
                key={col.status}
                className="flex w-72 flex-col border-r border-white/8 bg-white/[0.01]"
              >
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                  <span className={`text-xs font-semibold ${col.color}`}>{col.label}</span>
                  <span className="ml-auto text-xs text-white/20">{colTasks.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      columns={COLUMNS}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                  {colTasks.length === 0 && (
                    <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-white/5">
                      <span className="text-xs text-white/15">No tasks</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TaskCard({
  task,
  columns,
  onStatusChange,
}: {
  task: Task
  columns: typeof COLUMNS
  onStatusChange: (id: string, status: TaskStatus) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="group rounded-lg border border-white/8 bg-white/[0.03] p-3 hover:border-white/15 hover:bg-white/[0.05] transition-all cursor-pointer">
      <div className="flex items-start gap-2">
        <span className="flex-shrink-0 mt-0.5">{PRIORITY_ICONS[task.priority]}</span>
        <p className="flex-1 text-sm text-white/80 leading-snug">{task.title}</p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          onClick={(e) => e.stopPropagation()}
          className="rounded-md border border-white/8 bg-transparent px-1.5 py-0.5 text-[10px] text-white/40 outline-none hover:border-white/15 cursor-pointer"
        >
          {columns.map((c) => (
            <option key={c.status} value={c.status}>{c.label}</option>
          ))}
        </select>
        {task.assignee && (
          <div className="flex-shrink-0">
            {task.assignee.image ? (
              <Image
                src={task.assignee.image}
                alt={task.assignee.name || ""}
                width={18}
                height={18}
                className="rounded-full"
              />
            ) : (
              <div className="h-[18px] w-[18px] rounded-full bg-purple-500/30 flex items-center justify-center text-[9px] font-semibold text-purple-300">
                {(task.assignee.name || "?")[0].toUpperCase()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
