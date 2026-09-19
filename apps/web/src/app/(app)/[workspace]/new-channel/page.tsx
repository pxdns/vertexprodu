"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"

export default function NewChannelPage() {
  const router = useRouter()
  const params = useParams()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const slug = params.workspace as string

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError("")

    const res = await fetch(`/api/workspaces/${slug}/channels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: description.trim() }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Failed to create channel")
      setLoading(false)
      return
    }

    const channel = await res.json()
    router.push(`/${slug}/channel/${channel.id}`)
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Create a channel</h1>
          <p className="mt-1 text-sm text-white/40">Channels are where your team communicates.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-white/40">
              Name
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/30">
              <span className="text-white/30">#</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
                placeholder="e.g. engineering"
                required
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-white/40">
              Description <span className="text-white/20 normal-case font-normal tracking-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this channel about?"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/60 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 rounded-full bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
