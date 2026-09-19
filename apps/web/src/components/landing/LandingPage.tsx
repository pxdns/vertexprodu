"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

// ── Types ────────────────────────────────────────────────────
type KanbanCard = { title: string; priority: string | null; tag: string | null; dim?: boolean }
type KanbanColumn = { label: string; color: string; cards: KanbanCard[] }

// ── Constants ────────────────────────────────────────────────
const PLATFORMS = [
  {
    id: "mac",
    label: "Download for Mac",
    sub: "macOS 12+  ·  Apple Silicon & Intel",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
    primary: true,
  },
  {
    id: "windows",
    label: "Download for Windows",
    sub: "Windows 10 / 11  ·  x64",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
      </svg>
    ),
    primary: false,
  },
  {
    id: "linux",
    label: "Download for Linux",
    sub: ".deb  ·  .rpm  ·  AppImage",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021C7.309.358 3.491 4.868 3.491 9.733c0 2.34.902 4.636 2.446 6.291.369.404.751.834 1.058 1.317.306.484.536 1.01.536 1.638 0 .58-.17 1.164-.467 1.717-.306.556-.72 1.052-1.16 1.503-.392.403-.79.796-1.124 1.247-.337.455-.61.972-.716 1.58-.155.875.052 1.866.735 2.55.682.683 1.659.926 2.479.926 1.049 0 2.117-.378 2.99-1.019.87-.64 1.535-1.524 2.069-2.413.532-.889.935-1.824 1.254-2.674.097-.258.188-.511.273-.754.246-.715.42-1.314.54-1.809.12-.495.184-.884.233-1.192.05-.308.088-.524.142-.666.076-.203.195-.427.368-.703.16-.257.352-.553.563-.878.209-.325.432-.668.646-1.012.217-.348.426-.698.606-1.044.18-.346.33-.688.44-1.027.11-.339.182-.677.224-1.009.04-.331.056-.657.056-.975 0-4.998-3.929-9.264-9.006-9.264zm0 1.5c4.422 0 7.506 3.517 7.506 7.764 0 .268-.013.542-.046.81-.033.268-.085.531-.161.784-.077.253-.18.497-.307.733-.128.236-.28.463-.452.683-.172.22-.362.433-.566.64-.205.206-.422.406-.648.597l-.027.023a37.4 37.4 0 0 1-.696.546c-.237.18-.48.356-.726.527-.245.17-.494.335-.743.493-.249.157-.498.307-.746.45-.248.143-.494.278-.736.405-.241.127-.479.245-.712.354-.232.11-.459.21-.68.301-.22.09-.435.172-.642.245-.207.072-.406.135-.596.189-.191.054-.373.099-.544.135-.171.036-.331.064-.48.083-.149.02-.285.031-.411.031-.125 0-.244-.011-.354-.031s-.212-.047-.31-.082c-.097-.035-.19-.077-.278-.126-.088-.049-.172-.105-.252-.169-.079-.063-.155-.133-.226-.209-.072-.077-.138-.16-.199-.25-.06-.09-.115-.186-.163-.289-.048-.103-.09-.212-.124-.328-.035-.116-.063-.238-.084-.368-.02-.13-.034-.266-.034-.408 0-.7.164-1.36.455-1.969.291-.609.713-1.167 1.233-1.64.52-.473 1.136-.861 1.83-1.126.693-.265 1.459-.404 2.264-.404.805 0 1.571.139 2.264.404.694.265 1.31.653 1.83 1.126.52.473.942 1.031 1.233 1.64.291.609.455 1.269.455 1.969 0 .142-.014.278-.034.408-.021.13-.049.252-.084.368-.034.116-.076.225-.124.328-.048.103-.103.199-.163.289-.061.09-.127.173-.199.25-.071.076-.147.146-.226.209-.08.064-.164.12-.252.169-.088.049-.181.091-.278.126-.098.035-.2.062-.31.082-.11.02-.229.031-.354.031z"/>
      </svg>
    ),
    primary: false,
  },
]

const SIDEBAR_ITEMS: Array<{ id: string; type: "channel" | "nav"; label: string; hash?: string }> = [
  { id: "general", type: "channel", label: "general", hash: "#" },
  { id: "engineering", type: "channel", label: "engineering", hash: "#" },
  { id: "deploys", type: "channel", label: "deploys", hash: "#" },
  { id: "tasks", type: "nav", label: "Tasks" },
  { id: "roadmap", type: "nav", label: "Roadmap" },
]

const CHANNEL_MESSAGES: Record<string, Array<{ init: string; bg: string; color: string; name: string; time: string; text: string; code?: string; reaction?: string }>> = {
  general: [
    { init: "S", bg: "rgba(168,85,247,0.2)", color: "#c084fc", name: "Sarah K.", time: "9:02 AM", text: "Merged the auth refactor — v2.4.0 is live on staging 🎉", reaction: "🚀 3" },
    { init: "M", bg: "rgba(96,165,250,0.2)", color: "#93c5fd", name: "Marcus T.", time: "9:14 AM", text: "Nice. Can we get prod deployed before standup at 10?" },
    { init: "J", bg: "rgba(52,211,153,0.2)", color: "#6ee7b7", name: "Jamie L.", time: "9:18 AM", text: "On it — CI should finish in ~4 min.", reaction: "✅ 2" },
  ],
  engineering: [
    { init: "J", bg: "rgba(52,211,153,0.2)", color: "#6ee7b7", name: "Jamie L.", time: "10:32 AM", text: "Fixed the N+1 query on workspaces.", code: "commit a3b91f", reaction: "👍 5" },
    { init: "S", bg: "rgba(168,85,247,0.2)", color: "#c084fc", name: "Sarah K.", time: "10:35 AM", text: "Running load tests on staging now." },
    { init: "M", bg: "rgba(96,165,250,0.2)", color: "#93c5fd", name: "Marcus T.", time: "10:41 AM", text: "P99 dropped 820ms → 140ms. Ship it.", reaction: "✅ 3" },
  ],
  deploys: [
    { init: "V", bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", name: "Vertex Bot", time: "9:22 AM", text: "✅ acme/backend · main — prod deploy succeeded (2m 14s)" },
    { init: "V", bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", name: "Vertex Bot", time: "9:44 AM", text: "🔀 PR #142 merged — feat: real-time channel updates" },
    { init: "J", bg: "rgba(52,211,153,0.2)", color: "#6ee7b7", name: "Jamie L.", time: "9:46 AM", text: "Smooth. No errors on Sentry so far." },
  ],
}

const KANBAN_COLS: KanbanColumn[] = [
  {
    label: "Backlog",
    color: "rgba(255,255,255,0.3)",
    cards: [
      { title: "Sentry error spike on /api/tasks", priority: "#f97316", tag: "High" },
      { title: "Pagination for message history", priority: "#60a5fa", tag: null },
    ],
  },
  {
    label: "In Progress",
    color: "#60a5fa",
    cards: [
      { title: "Real-time updates via Pusher", priority: "#f97316", tag: "Urgent" },
      { title: "Settings page", priority: "#60a5fa", tag: null },
    ],
  },
  {
    label: "Done",
    color: "#22c55e",
    cards: [
      { title: "Auth refactor", priority: null, tag: null, dim: true },
      { title: "Workspace creation", priority: null, tag: null, dim: true },
    ],
  },
]

const ROADMAP_ITEMS = [
  { title: "v0.2 — real-time + search", pct: 42, status: "In Progress", statusColor: "#60a5fa" },
  { title: "Message search across channels", pct: 80, status: "In Progress", statusColor: "#60a5fa" },
  { title: "GitHub PR events in channels", pct: 15, status: "Planned", statusColor: "rgba(255,255,255,0.25)" },
  { title: "Emoji reactions + @mentions", pct: 60, status: "In Progress", statusColor: "#60a5fa" },
]

// ── Styles helpers ────────────────────────────────────────────
const card: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  background: "#0d0d0d",
  overflow: "hidden",
  boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
}

// ── Main component ────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [activeView, setActiveView] = useState<string>("general")

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#f0f0f0", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── Nav ───────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        background: scrolled ? "rgba(11,11,11,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        transition: "background 0.2s, border-color 0.2s",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <VertexIcon size={26} />
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "#f0f0f0" }}>Vertex</span>
            </div>
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {[["Features", "#features"], ["Download", "#download"], ["GitHub", "https://github.com/pxdns/vertexprodu"]].map(([label, href]) => (
                <NavLink key={label} href={href} label={label} />
              ))}
              <a
                href="#download"
                style={{
                  marginLeft: 6, padding: "6px 14px", borderRadius: 7,
                  background: "#f0f0f0", color: "#0b0b0b",
                  fontSize: 13, fontWeight: 600, textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}
              >
                Download
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "flex-start" }}>

          {/* Copy */}
          <div style={{ paddingTop: 4 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20,
              padding: "4px 12px", fontSize: 11, fontWeight: 600,
              color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em",
              textTransform: "uppercase", marginBottom: 28,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              Version 0.1.4 available
            </div>

            <h1 style={{
              fontSize: "clamp(34px, 4.5vw, 50px)",
              fontWeight: 700, lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "#f0f0f0", margin: "0 0 16px",
            }}>
              The workspace<br />
              engineers<br />
              actually want.
            </h1>

            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.42)", lineHeight: 1.65, maxWidth: 360, margin: "0 0 32px" }}>
              Channels, tasks, roadmap, and GitHub in one native desktop app. Download free — sign in with GitHub or Google.
            </p>

            {/* Download buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
              {PLATFORMS.map(p => (
                <DownloadButton key={p.id} platform={p} />
              ))}
            </div>

            <p style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.18)" }}>
              macOS · Windows · Linux · Free forever
            </p>
          </div>

          {/* Interactive app mockup */}
          <InteractiveMockup activeView={activeView} onViewChange={setActiveView} />
        </div>
      </section>

      {/* ── Auth callout ──────────────────────────────────────── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "18px 0",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", flex: 1 }}>
            Already have an account? Sign in from the app — or sign in on the web to manage your workspace.
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/signin" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "7px 14px", borderRadius: 7,
              background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)",
              fontSize: 13, fontWeight: 500, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <GithubIcon size={13} />
              Sign in with GitHub
            </Link>
            <Link href="/signin" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "7px 14px", borderRadius: 7,
              background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)",
              fontSize: 13, fontWeight: 500, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <GoogleIcon size={13} />
              Sign in with Google
            </Link>
          </div>
        </div>
      </div>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "88px 24px" }}>

        <FeatureRow
          eyebrow="Channels"
          heading="Communication that stays organised"
          body="Structured channels replace the noise. Code blocks, reactions, and search make every conversation referenceable — not buried in a DM somewhere."
          bullets={[
            "Inline code and syntax-highlighted blocks",
            "Emoji reactions and @mentions",
            "Full-text search across every message",
          ]}
          visual={<ChannelMockup />}
          reverse={false}
        />

        <Divider />

        <FeatureRow
          eyebrow="Tasks"
          heading="Ship without switching to another tool"
          body="A full kanban board built into the same workspace. Create, assign, and close work without context-switching to Linear or Jira."
          bullets={[
            "Backlog → Todo → In Progress → Done",
            "Priority levels, assignees, due dates",
            "Linked directly to channels and discussions",
          ]}
          visual={<TaskMockup />}
          reverse={true}
        />

        <Divider />

        <FeatureRow
          eyebrow="Roadmap"
          heading="Planning your whole team can see"
          body="Milestones and feature timelines visible to everyone. No stale document. No separate slide deck. The roadmap lives where the work happens."
          bullets={[
            "Milestone tracking with progress bars",
            "Planned, in progress, and shipped states",
            "Visible to every workspace member",
          ]}
          visual={<RoadmapMockup />}
          reverse={false}
        />

        <Divider />

        <FeatureRow
          id="github-section"
          eyebrow="GitHub"
          heading="Close the loop between code and conversation"
          body="Connect a repository and get PR events, merges, and CI results posted directly into channels. No webhooks to configure. No bots."
          bullets={[
            "Rich PR previews with CI check status",
            "Push and merge notifications in #deploys",
            "Works with public and private repos",
          ]}
          visual={<GithubMockup />}
          reverse={true}
        />
      </section>

      {/* ── Download section ──────────────────────────────────── */}
      <section id="download" style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "72px 24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700,
            letterSpacing: "-0.04em", color: "#f0f0f0",
            margin: "0 0 10px",
          }}>
            Available on every platform.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.38)", margin: "0 0 36px", lineHeight: 1.6 }}>
            Native desktop app for macOS, Windows, and Linux. Sign in with GitHub or Google — your workspace loads instantly.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {PLATFORMS.map(p => (
              <DownloadButton key={p.id} platform={p} />
            ))}
          </div>
          <div style={{ marginTop: 28, padding: "16px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", display: "inline-block" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>
              Already installed?{" "}
              <a href="vertex://open" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline", textUnderlineOffset: 2 }}>
                Open Vertex
              </a>
              {" · "}
              <Link href="/signin" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline", textUnderlineOffset: 2 }}>
                Sign in on web
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "22px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <VertexIcon size={18} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>Vertex</span>
          </div>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.18)" }}>© 2025 Vertex</span>
          <div style={{ display: "flex", gap: 20 }}>
            {[["Privacy", "#"], ["Terms", "#"], ["GitHub", "https://github.com/pxdns/vertexprodu"]].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Interactive hero mockup ────────────────────────────────────
function InteractiveMockup({ activeView, onViewChange }: { activeView: string; onViewChange: (v: string) => void }) {
  const msgs = CHANNEL_MESSAGES[activeView as keyof typeof CHANNEL_MESSAGES]

  return (
    <div style={{ ...card, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
      {/* Window chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f56" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ffbd2e" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#27c93f" }} />
        <span style={{ flex: 1, textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Vertex</span>
      </div>

      <div style={{ display: "flex", height: 360 }}>
        {/* Sidebar */}
        <div style={{ width: 168, borderRight: "1px solid rgba(255,255,255,0.07)", flexShrink: 0, background: "#0b0b0b" }}>
          <div style={{ padding: "10px 10px 6px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <VertexIcon size={16} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Acme Eng</span>
            </div>
          </div>

          <div style={{ padding: "8px 6px" }}>
            {/* Channels */}
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", padding: "0 4px 4px" }}>Channels</p>
            {SIDEBAR_ITEMS.filter(i => i.type === "channel").map(item => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 5, width: "100%",
                  padding: "4px 8px", borderRadius: 5, marginBottom: 1,
                  background: activeView === item.id ? "rgba(255,255,255,0.06)" : "transparent",
                  borderLeft: activeView === item.id ? "2px solid rgba(255,255,255,0.3)" : "2px solid transparent",
                  paddingLeft: activeView === item.id ? 6 : 8,
                  border: "none", cursor: "pointer", textAlign: "left",
                }}
              >
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{item.hash}</span>
                <span style={{ fontSize: 11, color: activeView === item.id ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)" }}>{item.label}</span>
              </button>
            ))}

            {/* Nav items */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "8px 0", paddingTop: 8 }}>
              {SIDEBAR_ITEMS.filter(i => i.type === "nav").map(item => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7, width: "100%",
                    padding: "4px 8px", borderRadius: 5, marginBottom: 1,
                    background: activeView === item.id ? "rgba(255,255,255,0.06)" : "transparent",
                    borderLeft: activeView === item.id ? "2px solid rgba(255,255,255,0.3)" : "2px solid transparent",
                    paddingLeft: activeView === item.id ? 6 : 8,
                    border: "none", cursor: "pointer", textAlign: "left",
                  }}
                >
                  {item.id === "tasks" ? <TaskIcon /> : <RoadmapIcon />}
                  <span style={{ fontSize: 11, color: activeView === item.id ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)" }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Channel views */}
          {msgs && (
            <>
              <div style={{ padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>#</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{activeView}</span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>12 members</span>
              </div>
              <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 0, overflowY: "auto" }}>
                {msgs.map((msg, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: msg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: msg.color, flexShrink: 0, marginTop: 2 }}>{msg.init}</div>
                    <div>
                      <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{msg.name}</span>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{msg.time}</span>
                      </div>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                        {msg.text}
                        {msg.code && <span style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "0 5px", fontSize: 10, fontFamily: "monospace", color: "rgba(165,180,251,0.8)", marginLeft: 4 }}>{msg.code}</span>}
                      </span>
                      {msg.reaction && <div style={{ marginTop: 3 }}><span style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "1px 6px", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{msg.reaction}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "8px 12px" }}>
                <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.02)" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", flex: 1 }}>Message #{activeView}</span>
                  <button style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
                    <SendIcon />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Tasks view */}
          {activeView === "tasks" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Tasks</span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>14 total</span>
              </div>
              <div style={{ flex: 1, display: "flex", overflowX: "auto" }}>
                {KANBAN_COLS.map(col => (
                  <div key={col.label} style={{ minWidth: 130, flex: 1, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "7px 8px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: col.color }}>{col.label}</span>
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{col.cards.length}</span>
                    </div>
                    <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
                      {col.cards.map(c => (
                        <div key={c.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 7px", opacity: c.dim ? 0.45 : 1 }}>
                          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1.4, margin: "0 0 5px" }}>{c.title}</p>
                          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                            {c.priority && <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.priority }} />}
                            {c.tag && <span style={{ fontSize: 9, fontWeight: 600, color: c.tag === "Urgent" ? "#f97316" : "#fde047", background: c.tag === "Urgent" ? "rgba(249,115,22,0.12)" : "rgba(250,204,21,0.12)", border: `1px solid ${c.tag === "Urgent" ? "rgba(249,115,22,0.2)" : "rgba(250,204,21,0.2)"}`, borderRadius: 8, padding: "1px 5px" }}>{c.tag}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Roadmap view */}
          {activeView === "roadmap" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Roadmap</span>
              </div>
              <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5, overflowY: "auto" }}>
                {ROADMAP_ITEMS.map(item => (
                  <div key={item.title} style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, padding: "7px 10px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                    </div>
                    <div style={{ width: 50, flexShrink: 0 }}>
                      <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)" }}>
                        <div style={{ width: `${item.pct}%`, height: "100%", borderRadius: 2, background: "rgba(255,255,255,0.3)" }} />
                      </div>
                      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", margin: "2px 0 0", textAlign: "right" }}>{item.pct}%</p>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 600, color: item.statusColor, border: `1px solid ${item.statusColor === "#60a5fa" ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "2px 6px", flexShrink: 0 }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Feature section ────────────────────────────────────────────
function FeatureRow({
  eyebrow, heading, body, bullets, visual, reverse, id,
}: {
  eyebrow: string
  heading: string
  body: string
  bullets: string[]
  visual: React.ReactNode
  reverse: boolean
  id?: string
}) {
  return (
    <div id={id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
      <div style={{ order: reverse ? 2 : 1 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 12px" }}>{eyebrow}</p>
        <h2 style={{ fontSize: "clamp(21px, 2.6vw, 30px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2, color: "#f0f0f0", margin: "0 0 12px" }}>{heading}</h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: "0 0 20px" }}>{body}</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {bullets.map(b => (
            <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 14, color: "rgba(255,255,255,0.42)" }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, flexShrink: 0, marginTop: 2, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-3" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ order: reverse ? 1 : 2 }}>{visual}</div>
    </div>
  )
}

// ── Feature visual mockups ─────────────────────────────────────
function MockupShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={card}>
      <div style={{ padding: "9px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.02)" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <span style={{ flex: 1, textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function ChannelMockup() {
  return (
    <MockupShell title="#engineering">
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 0 }}>
        {[
          { init: "J", bg: "rgba(52,211,153,0.2)", color: "#6ee7b7", name: "Jamie L.", time: "10:32 AM", text: "Fixed the N+1 query on workspaces.", code: "commit a3b91f", reaction: "👍 5 🔥 2" },
          { init: "S", bg: "rgba(168,85,247,0.2)", color: "#c084fc", name: "Sarah K.", time: "10:35 AM", text: "Running load tests on staging.", reaction: null },
          { init: "M", bg: "rgba(96,165,250,0.2)", color: "#93c5fd", name: "Marcus T.", time: "10:41 AM", text: "P99 dropped 820ms → 140ms. Ship it.", reaction: "✅ 3" },
        ].map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: msg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: msg.color, flexShrink: 0, marginTop: 2 }}>{msg.init}</div>
            <div>
              <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{msg.name}</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{msg.time}</span>
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                {msg.text}
                {msg.code && <span style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "0 5px", fontSize: 10, fontFamily: "monospace", color: "rgba(165,180,251,0.8)", marginLeft: 4 }}>{msg.code}</span>}
              </span>
              {msg.reaction && <div style={{ marginTop: 4 }}><span style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "1px 6px", fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{msg.reaction}</span></div>}
            </div>
          </div>
        ))}
      </div>
    </MockupShell>
  )
}

function TaskMockup() {
  return (
    <MockupShell title="Tasks — Acme Engineering">
      <div style={{ display: "flex", height: 210 }}>
        {KANBAN_COLS.map(col => (
          <div key={col.label} style={{ flex: 1, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "7px 8px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: col.color }}>{col.label}</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{col.cards.length}</span>
            </div>
            <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 4 }}>
              {col.cards.map(c => (
                <div key={c.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 7px", opacity: c.dim ? 0.45 : 1 }}>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1.4, margin: "0 0 4px" }}>{c.title}</p>
                  <div style={{ display: "flex", gap: 4 }}>
                    {c.priority && <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.priority }} />}
                    {c.tag && <span style={{ fontSize: 9, fontWeight: 600, color: c.tag === "Urgent" ? "#f97316" : "#fde047", background: c.tag === "Urgent" ? "rgba(249,115,22,0.12)" : "rgba(250,204,21,0.12)", border: `1px solid ${c.tag === "Urgent" ? "rgba(249,115,22,0.2)" : "rgba(250,204,21,0.2)"}`, borderRadius: 8, padding: "1px 5px" }}>{c.tag}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MockupShell>
  )
}

function RoadmapMockup() {
  return (
    <MockupShell title="Roadmap">
      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
        {ROADMAP_ITEMS.map(item => (
          <div key={item.title} style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, padding: "7px 10px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
            </div>
            <div style={{ width: 50, flexShrink: 0 }}>
              <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)" }}>
                <div style={{ width: `${item.pct}%`, height: "100%", borderRadius: 2, background: "rgba(255,255,255,0.3)" }} />
              </div>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", margin: "2px 0 0", textAlign: "right" }}>{item.pct}%</p>
            </div>
            <span style={{ fontSize: 9, fontWeight: 600, color: item.statusColor, border: `1px solid ${item.statusColor === "#60a5fa" ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "2px 6px", flexShrink: 0 }}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </MockupShell>
  )
}

function GithubMockup() {
  return (
    <MockupShell title="GitHub · acme/backend">
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><circle cx="3" cy="3" r="1.5" stroke="#22c55e" strokeWidth="1.2"/><circle cx="3" cy="9" r="1.5" stroke="#22c55e" strokeWidth="1.2"/><circle cx="9" cy="3" r="1.5" stroke="#22c55e" strokeWidth="1.2"/><path d="M3 4.5v3M4.5 3h2a2 2 0 0 1 2 2v0" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", margin: "0 0 2px" }}>feat: real-time channel updates via Pusher</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", margin: 0 }}>#142 · Jamie L. · into main</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "2px 7px", background: "rgba(34,197,94,0.08)" }}>● Open</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(165,180,251,0.8)", border: "1px solid rgba(165,180,251,0.15)", borderRadius: 8, padding: "2px 7px" }}>feature</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "2px 7px" }}>+312 −47</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[["#22c55e", "CI build passed (2m 14s)"], ["#22c55e", "Tests · 94 passed"], ["#fbbf24", "1 review requested — Sarah K."]].map(([col, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: col, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, padding: "7px 10px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", flex: 1 }}>acme/backend · <strong style={{ color: "rgba(255,255,255,0.6)" }}>main</strong> — prod deploy succeeded</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>2m ago</span>
        </div>
      </div>
    </MockupShell>
  )
}

// ── Small components ───────────────────────────────────────────
function DownloadButton({ platform }: { platform: typeof PLATFORMS[number] }) {
  return (
    <a
      href="#"
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", borderRadius: 8, textDecoration: "none",
        background: platform.primary ? "#f0f0f0" : "rgba(255,255,255,0.05)",
        color: platform.primary ? "#0b0b0b" : "rgba(255,255,255,0.65)",
        border: platform.primary ? "none" : "1px solid rgba(255,255,255,0.1)",
        transition: "opacity 0.12s",
      }}
    >
      <span style={{ color: platform.primary ? "#0b0b0b" : "rgba(255,255,255,0.5)", display: "flex", alignItems: "center" }}>{platform.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{platform.label}</div>
        <div style={{ fontSize: 11, opacity: 0.55, lineHeight: 1.2, marginTop: 1 }}>{platform.sub}</div>
      </div>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.4 }}>
        <path d="M2.5 6h7M6 2.5L9.5 6 6 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      style={{ padding: "5px 12px", borderRadius: 6, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}
    >
      {label}
    </a>
  )
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "72px 0" }} />
}

// ── Icons ──────────────────────────────────────────────────────
function VertexIcon({ size }: { size: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.27), background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 14 14" fill="none">
        <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="#0b0b0b" />
      </svg>
    </div>
  )
}

function GithubIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

function GoogleIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function TaskIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <rect x="1" y="1" width="10" height="10" rx="2" stroke="rgba(255,255,255,0.3)" strokeWidth="1.1"/>
      <path d="M3.5 6l2 2 3-3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function RoadmapIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path d="M1 9L3.5 5l3 3.5 2.5-4.5L11 7" stroke="rgba(255,255,255,0.3)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
      <path d="M9 1L5 5.5M9 1L6.5 9L5 5.5M9 1L1 3.5L5 5.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
