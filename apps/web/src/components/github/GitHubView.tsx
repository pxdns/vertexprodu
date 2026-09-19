"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Integration = {
  id: string
  repoOwner: string
  repoName: string
} | null

type Props = {
  workspaceSlug: string
  integration: Integration
}

type PR = {
  number: number
  title: string
  state: "open" | "closed" | "merged"
  user: { login: string; avatar_url: string }
  html_url: string
  created_at: string
  draft: boolean
}

type Commit = {
  sha: string
  commit: {
    message: string
    author: { name: string; date: string }
  }
  html_url: string
  author: { login: string; avatar_url: string } | null
}

export default function GitHubView({ workspaceSlug, integration }: Props) {
  const router = useRouter()
  const [repoOwner, setRepoOwner] = useState("")
  const [repoName, setRepoName] = useState("")
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState("")

  const [prs, setPRs] = useState<PR[]>([])
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<"prs" | "commits">("prs")

  const handleConnect = async (e: FormEvent) => {
    e.preventDefault()
    if (!repoOwner.trim() || !repoName.trim()) return
    setConnecting(true)
    setError("")
    const res = await fetch(`/api/workspaces/${workspaceSlug}/github`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoOwner: repoOwner.trim(), repoName: repoName.trim() }),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Failed to connect repository")
    } else {
      router.refresh()
    }
    setConnecting(false)
  }

  const loadData = async () => {
    if (!integration || loaded) return
    setLoading(true)
    const [prsRes, commitsRes] = await Promise.all([
      fetch(`/api/github/${integration.repoOwner}/${integration.repoName}/pulls`),
      fetch(`/api/github/${integration.repoOwner}/${integration.repoName}/commits`),
    ])
    if (prsRes.ok) setPRs(await prsRes.json())
    if (commitsRes.ok) setCommits(await commitsRes.json())
    setLoaded(true)
    setLoading(false)
  }

  // Load on mount if integrated
  if (integration && !loaded && !loading) {
    loadData()
  }

  if (!integration) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-white/5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white/40">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Connect a GitHub repository</h2>
        <p className="mt-2 mb-8 text-sm text-white/40 max-w-sm">
          Link a repo to surface pull requests and commits directly inside your workspace.
        </p>

        <form onSubmit={handleConnect} className="w-full max-w-sm space-y-3 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-white/40">
              Repository owner
            </label>
            <input
              type="text"
              value={repoOwner}
              onChange={(e) => setRepoOwner(e.target.value)}
              placeholder="e.g. vercel"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase text-white/40">
              Repository name
            </label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="e.g. next.js"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={connecting}
            className="w-full rounded-full bg-purple-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-600 disabled:opacity-50 transition-colors"
          >
            {connecting ? "Connecting..." : "Connect repository"}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-white/8 bg-white/[0.03] p-1 w-fit">
        {(["prs", "commits"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab === "prs" ? "Pull Requests" : "Commits"}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      )}

      {/* Pull Requests */}
      {!loading && activeTab === "prs" && (
        <div className="space-y-2">
          {prs.length === 0 ? (
            <div className="text-center py-12 text-sm text-white/30">No pull requests found.</div>
          ) : (
            prs.map((pr) => (
              <a
                key={pr.number}
                href={pr.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 hover:border-white/15 hover:bg-white/[0.05] transition-all"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {pr.state === "open" ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="4" cy="4" r="2.5" stroke="#22c55e" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="2.5" stroke="#22c55e" strokeWidth="1.5" />
                      <path d="M4 6.5v3a2 2 0 0 0 2 2h2" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="4" cy="4" r="2.5" stroke="#a855f7" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="2.5" stroke="#a855f7" strokeWidth="1.5" />
                      <path d="M4 6.5v3a2 2 0 0 0 2 2h2M10 4l2 2-2 2" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{pr.title}</p>
                    {pr.draft && (
                      <span className="flex-shrink-0 rounded-full border border-white/10 px-1.5 py-0.5 text-[10px] text-white/30">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/30 mt-0.5">
                    #{pr.number} · {pr.user.login} ·{" "}
                    {new Date(pr.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </a>
            ))
          )}
        </div>
      )}

      {/* Commits */}
      {!loading && activeTab === "commits" && (
        <div className="space-y-2">
          {commits.length === 0 ? (
            <div className="text-center py-12 text-sm text-white/30">No commits found.</div>
          ) : (
            commits.map((commit) => (
              <a
                key={commit.sha}
                href={commit.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 hover:border-white/15 hover:bg-white/[0.05] transition-all"
              >
                <div className="flex-shrink-0 mt-1">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" className="text-white/30" />
                    <path d="M7 1v3M7 10v3M1 7h3M10 7h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-white/20" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate leading-snug">
                    {commit.commit.message.split("\n")[0]}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5 font-mono">
                    {commit.sha.slice(0, 7)} · {commit.commit.author.name} ·{" "}
                    {new Date(commit.commit.author.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  )
}
