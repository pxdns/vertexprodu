"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type ItemType = "MILESTONE" | "FEATURE"
type ItemStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

type RoadmapItem = {
  id: string
  title: string
  description: string | null
  type: ItemType
  status: ItemStatus
  targetDate: Date | null
  progress: number
  createdAt: Date
}

type Props = {
  workspaceSlug: string
  initialItems: RoadmapItem[]
}

const STATUS_COLORS: Record<ItemStatus, string> = {
  PLANNED: "text-white/40 bg-white/5 border-white/10",
  IN_PROGRESS: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  COMPLETED: "text-green-400 bg-green-400/10 border-green-400/20",
  CANCELLED: "text-red-400 bg-red-400/10 border-red-400/20",
}

const STATUS_LABELS: Record<ItemStatus, string> = {
  PLANNED: "Planned",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

export default function RoadmapView({ workspaceSlug, initialItems }: Props) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newType, setNewType] = useState<ItemType>("FEATURE")
  const [newStatus, setNewStatus] = useState<ItemStatus>("PLANNED")
  const [newDate, setNewDate] = useState("")
  const [creating, setCreating] = useState(false)

  const milestones = items.filter((i) => i.type === "MILESTONE")
  const features = items.filter((i) => i.type === "FEATURE")

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setCreating(true)
    const res = await fetch(`/api/workspaces/${workspaceSlug}/roadmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        type: newType,
        status: newStatus,
        targetDate: newDate || undefined,
      }),
    })
    if (res.ok) {
      const item = await res.json()
      setItems((prev) => [item, ...prev])
      setNewTitle("")
      setNewDescription("")
      setNewDate("")
      setShowCreate(false)
      router.refresh()
    }
    setCreating(false)
  }

  const handleStatusChange = async (id: string, status: ItemStatus) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    await fetch(`/api/roadmap/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    router.refresh()
  }

  return (
    <div className="p-6 space-y-8">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 rounded-full bg-purple-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-600 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          New item
        </button>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#111] p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-semibold">New roadmap item</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title"
                required
                autoFocus
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-white/40">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ItemType)}
                    className="w-full rounded-xl border border-white/10 bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="FEATURE">Feature</option>
                    <option value="MILESTONE">Milestone</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/40">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ItemStatus)}
                    className="w-full rounded-xl border border-white/10 bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none"
                  >
                    {(Object.keys(STATUS_LABELS) as ItemStatus[]).map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/40">Target date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
                />
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

      {/* Milestones */}
      {milestones.length > 0 && (
        <section>
          <h2 className="mb-4 text-xs font-semibold tracking-widest uppercase text-white/30">
            Milestones
          </h2>
          <div className="space-y-2">
            {milestones.map((item) => (
              <RoadmapItemCard
                key={item.id}
                item={item}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section>
          <h2 className="mb-4 text-xs font-semibold tracking-widest uppercase text-white/30">
            Features
          </h2>
          <div className="space-y-2">
            {features.map((item) => (
              <RoadmapItemCard
                key={item.id}
                item={item}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </section>
      )}

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-4xl">🗺️</div>
          <h3 className="text-lg font-semibold">No roadmap items yet</h3>
          <p className="mt-2 text-sm text-white/40">Add milestones and features to plan your product journey.</p>
        </div>
      )}
    </div>
  )
}

function RoadmapItemCard({
  item,
  onStatusChange,
}: {
  item: RoadmapItem
  onStatusChange: (id: string, status: ItemStatus) => void
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 hover:border-white/15 hover:bg-white/[0.05] transition-all">
      {/* Type icon */}
      <div className="flex-shrink-0">
        {item.type === "MILESTONE" ? (
          <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L7.5 4.5H11L8 7l1 3.5L6 8.5 3 10.5l1-3.5-3-2.5h3.5L6 1Z" fill="#a855f7" />
            </svg>
          </div>
        ) : (
          <div className="h-6 w-6 rounded-full bg-white/8 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="1" y="1" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" className="text-white/30" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{item.title}</p>
        {item.description && (
          <p className="text-xs text-white/40 truncate mt-0.5">{item.description}</p>
        )}
      </div>

      {/* Progress bar */}
      {item.progress > 0 && (
        <div className="w-24 flex-shrink-0">
          <div className="h-1 rounded-full bg-white/8">
            <div
              className="h-1 rounded-full bg-purple-500"
              style={{ width: `${item.progress}%` }}
            />
          </div>
          <p className="text-[10px] text-white/30 mt-0.5 text-right">{item.progress}%</p>
        </div>
      )}

      {/* Target date */}
      {item.targetDate && (
        <span className="flex-shrink-0 text-xs text-white/30">
          {new Date(item.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      )}

      {/* Status */}
      <select
        value={item.status}
        onChange={(e) => onStatusChange(item.id, e.target.value as ItemStatus)}
        className={`flex-shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium outline-none cursor-pointer ${STATUS_COLORS[item.status]}`}
        style={{ backgroundColor: "transparent" }}
      >
        {(Object.keys(STATUS_LABELS) as ItemStatus[]).map((s) => (
          <option key={s} value={s} className="bg-[#0d0d0d] text-white">{STATUS_LABELS[s]}</option>
        ))}
      </select>
    </div>
  )
}
