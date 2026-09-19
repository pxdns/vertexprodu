"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewWorkspacePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError("")

    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Failed to create workspace")
      setLoading(false)
      return
    }

    const workspace = await res.json()
    router.push(`/${workspace.slug}`)
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0d0d0d]">
      <div className="w-full max-w-md space-y-8 px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">Vertex</span>
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Create your workspace</h1>
          <p className="mt-2 text-sm text-white/50">Give your team a home to build together.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-widest uppercase text-white/40">
              Workspace name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Engineering"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
            />
            {name && (
              <p className="text-xs text-white/30">
                URL: vertex.app/
                <span className="text-white/50">
                  {name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
                </span>
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full rounded-full bg-purple-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create workspace"}
          </button>
        </form>
      </div>
    </div>
  )
}
