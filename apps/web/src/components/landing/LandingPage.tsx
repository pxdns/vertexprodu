"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: "#0b0b0b", color: "#f0f0f0" }}>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky", top: 0, zIndex: 50,
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
          background: scrolled ? "rgba(11,11,11,0.82)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          transition: "background 0.2s, border-color 0.2s",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 7,
                background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="#0b0b0b" strokeWidth="0"/>
                </svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>Vertex</span>
            </div>

            {/* Links */}
            <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
              {[["Features", "#features"], ["GitHub", "#github-section"], ["Get started", "#cta"]].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    padding: "5px 12px", borderRadius: 6, fontSize: 13, fontWeight: 500,
                    color: label === "Get started" ? "#0b0b0b" : "rgba(255,255,255,0.5)",
                    background: label === "Get started" ? "#fff" : "transparent",
                    textDecoration: "none",
                    transition: "color 0.12s, background 0.12s",
                  }}
                  onMouseEnter={e => {
                    if (label !== "Get started") (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)"
                  }}
                  onMouseLeave={e => {
                    if (label !== "Get started") (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "flex-start" }}>

          {/* Copy */}
          <div style={{ paddingTop: 8 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20,
              padding: "4px 12px", fontSize: 11, fontWeight: 600,
              color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em",
              textTransform: "uppercase", marginBottom: 28,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              Open beta
            </div>

            <h1 style={{
              fontSize: "clamp(36px, 5vw, 52px)",
              fontWeight: 700, lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "#f5f5f5",
              margin: "0 0 16px",
            }}>
              The workspace<br />
              engineers<br />
              actually want.
            </h1>

            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.65,
              maxWidth: 360, margin: "0 0 32px",
            }}>
              Channels, tasks, roadmap, and GitHub in one lightweight workspace. Stop switching tabs. Start shipping.
            </p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link href="/signin" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "9px 16px", borderRadius: 8,
                background: "#f5f5f5", color: "#0b0b0b",
                fontSize: 13, fontWeight: 600,
                textDecoration: "none", border: "none",
                transition: "opacity 0.12s",
              }}>
                <GithubIcon size={15} color="#0b0b0b" />
                Continue with GitHub
              </Link>
              <Link href="/signin" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "9px 16px", borderRadius: 8,
                background: "transparent", color: "rgba(255,255,255,0.6)",
                fontSize: 13, fontWeight: 500,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                transition: "border-color 0.12s, color 0.12s",
              }}>
                Continue with Google
              </Link>
            </div>

            <p style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
              No credit card required
            </p>
          </div>

          {/* App mockup */}
          <AppMockup />
        </div>
      </section>

      {/* ── Social strip ────────────────────────────────────── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "20px 0",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>
              Used by teams at
            </span>
            {["Acme Corp", "Forge Studio", "Arc Systems", "Stealth Labs", "Nomad Works", "Pulsar Dev"].map(c => (
              <span key={c} style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.3)" }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ────────────────────────────────────────── */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 24px" }}>

        {/* Channels */}
        <FeatureRow
          eyebrow="Channels"
          heading="Communication that stays on topic"
          body="Organised channels replace the noise. Code blocks, emoji reactions, and full-text search make every conversation referenceable and permanent — not buried in a DM thread somewhere."
          bullets={[
            "Inline code and syntax-highlighted blocks",
            "Emoji reactions and @mentions",
            "Full-text search across every message",
          ]}
          visual={<ChannelMockup />}
          reverse={false}
        />

        <Divider />

        {/* Tasks */}
        <FeatureRow
          eyebrow="Tasks"
          heading="Ship without a separate project tool"
          body="A full-featured kanban board and task list built into the same workspace. Create, assign, and close work without context-switching to Linear or Jira."
          bullets={[
            "Backlog → Todo → In Progress → Done columns",
            "Priorities, assignees, and due dates",
            "Linked directly to channels and discussions",
          ]}
          visual={<TaskMockup />}
          reverse={true}
        />

        <Divider />

        {/* Roadmap */}
        <FeatureRow
          eyebrow="Roadmap"
          heading="Planning that teams actually read"
          body="Milestones and feature timelines visible to the whole workspace. No separate document. No stale slide deck. The roadmap lives where the work happens."
          bullets={[
            "Milestone tracking with progress bars",
            "Planned, in progress, and shipped states",
            "Visible to every workspace member",
          ]}
          visual={<RoadmapMockup />}
          reverse={false}
        />

        <Divider />

        {/* GitHub */}
        <FeatureRow
          id="github-section"
          eyebrow="GitHub Integration"
          heading="Close the loop between code and conversation"
          body="Connect a repository and get PR events, merges, and CI results posted directly into your channels. No webhooks to configure manually. No third-party bots."
          bullets={[
            "Rich PR previews with CI status",
            "Push and merge notifications in #deploys",
            "Works with public and private repos",
          ]}
          visual={<GithubMockup />}
          reverse={true}
          accent
        />
      </section>

      {/* ── Final CTA ───────────────────────────────────────── */}
      <section id="cta" style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700,
            letterSpacing: "-0.04em", color: "#f5f5f5",
            margin: "0 0 12px",
          }}>
            Start building today.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", margin: "0 0 28px", lineHeight: 1.6 }}>
            Sign in with GitHub or Google and your workspace is live in under a minute.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signin" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 8,
              background: "#f5f5f5", color: "#0b0b0b",
              fontSize: 14, fontWeight: 600,
              textDecoration: "none",
            }}>
              <GithubIcon size={16} color="#0b0b0b" />
              Get started free
            </Link>
          </div>
          <p style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,0.18)" }}>
            Free forever · No setup fees
          </p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="9" height="9" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="#0b0b0b"/>
              </svg>
            </div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>Vertex</span>
          </div>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2025 Vertex. Build together, ship faster.</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "GitHub"].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ── Shared sub-components ──────────────────────────────────── */

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "72px 0" }} />
}

function FeatureRow({ eyebrow, heading, body, bullets, visual, reverse, accent, id }: {
  eyebrow: string
  heading: string
  body: string
  bullets: string[]
  visual: React.ReactNode
  reverse: boolean
  accent?: boolean
  id?: string
}) {
  return (
    <div id={id} style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 56,
      alignItems: "center",
    }}>
      <div style={{ order: reverse ? 2 : 1 }}>
        <p style={{
          fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase",
          color: accent ? "#22c55e" : "rgba(255,255,255,0.35)",
          margin: "0 0 12px",
        }}>{eyebrow}</p>
        <h2 style={{
          fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 700,
          letterSpacing: "-0.03em", lineHeight: 1.2,
          color: "#f0f0f0", margin: "0 0 14px",
        }}>{heading}</h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: "0 0 20px" }}>{body}</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {bullets.map(b => (
            <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 14, color: "rgba(255,255,255,0.45)" }}>
              <span style={{
                width: 14, height: 14, borderRadius: 4, flexShrink: 0, marginTop: 2,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4l2 2 3-3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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

/* ── Hero app mockup ─────────────────────────────────────────── */
function AppMockup() {
  return (
    <div style={{
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      background: "#0d0d0d",
      overflow: "hidden",
      boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    }}>
      {/* Window chrome */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "9px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.02)",
      }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f56" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ffbd2e" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#27c93f" }} />
        <span style={{ flex: 1, textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Vertex — Acme Engineering</span>
      </div>
      {/* Shell */}
      <div style={{ display: "flex", height: 360 }}>
        {/* Sidebar */}
        <div style={{ width: 168, borderRight: "1px solid rgba(255,255,255,0.07)", flexShrink: 0, background: "#0b0b0b" }}>
          <div style={{ padding: "10px 10px 6px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="8" height="8" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="#0b0b0b"/></svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Acme Eng</span>
            </div>
          </div>
          <div style={{ padding: "8px 6px" }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", padding: "0 4px 4px" }}>Channels</p>
            {[["general", true], ["engineering", false], ["deploys", false]].map(([name, active]) => (
              <div key={String(name)} style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "4px 8px", borderRadius: 5, marginBottom: 1,
                background: active ? "rgba(255,255,255,0.06)" : "transparent",
                borderLeft: active ? "2px solid rgba(255,255,255,0.3)" : "2px solid transparent",
                paddingLeft: active ? 6 : 8,
              }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>#</span>
                <span style={{ fontSize: 11, color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)" }}>{String(name)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "8px 0", paddingTop: 8 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", padding: "0 4px 4px" }}>Direct</p>
              {[["S", "Sarah K.", "rgba(168,85,247,0.25)", "#c084fc"], ["M", "Marcus T.", "rgba(96,165,250,0.2)", "#93c5fd"]].map(([letter, name, bg, color]) => (
                <div key={String(name)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 5 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: String(bg), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 700, color: String(color), flexShrink: 0 }}>{String(letter)}</div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{String(name)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Channel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "8px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>#</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>general</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>12 members</span>
          </div>
          <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 0, overflowY: "auto" }}>
            {[
              { init: "S", bg: "rgba(168,85,247,0.2)", color: "#c084fc", name: "Sarah K.", time: "9:02 AM", text: "Merged the auth refactor — v2.4.0 is live on staging 🎉", code: null, reaction: "🚀 3" },
              { init: "M", bg: "rgba(96,165,250,0.2)", color: "#93c5fd", name: "Marcus T.", time: "9:14 AM", text: "Nice. Can we get a prod deploy before standup at 10?", code: null, reaction: null },
              { init: "J", bg: "rgba(52,211,153,0.2)", color: "#6ee7b7", name: "Jamie L.", time: "9:18 AM", text: "On it — CI should finish in ~4 min.", code: null, reaction: "✅ 2" },
            ].map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: msg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: msg.color, flexShrink: 0, marginTop: 2 }}>{msg.init}</div>
                <div>
                  <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 2 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{msg.name}</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{msg.time}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{msg.text}</span>
                  {msg.reaction && (
                    <div style={{ marginTop: 3 }}>
                      <span style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "1px 6px", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{msg.reaction}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "8px 12px" }}>
            <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.02)" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", flex: 1 }}>Message #general</span>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M9 1L5 5.5M9 1L6.5 9L5 5.5M9 1L1 3.5L5 5.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Feature visual mockups ──────────────────────────────────── */
function MockupShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, background: "#0d0d0d",
      overflow: "hidden",
      boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
    }}>
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
          { init: "J", bg: "rgba(52,211,153,0.2)", color: "#6ee7b7", name: "Jamie L.", time: "10:32 AM", text: "Pushed the fix for the N+1 query on workspaces.", code: "git commit a3b91f", reaction: "👍 5 🔥 2" },
          { init: "S", bg: "rgba(168,85,247,0.2)", color: "#c084fc", name: "Sarah K.", time: "10:35 AM", text: "Nice catch. Running load tests on staging now.", code: null, reaction: null },
          { init: "M", bg: "rgba(96,165,250,0.2)", color: "#93c5fd", name: "Marcus T.", time: "10:41 AM", text: "Staging clean. P99 dropped from 820ms to 140ms. Ship it.", code: null, reaction: "✅ 3" },
        ].map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: msg.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: msg.color, flexShrink: 0, marginTop: 2 }}>{msg.init}</div>
            <div>
              <div style={{ display: "flex", gap: 6, alignItems: "baseline", marginBottom: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{msg.name}</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{msg.time}</span>
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{msg.text}</span>
              {msg.code && <span style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "0 5px", fontSize: 10, fontFamily: "monospace", color: "rgba(165,180,251,0.8)", marginLeft: 4 }}>{msg.code}</span>}
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
      <div style={{ display: "flex", height: 220, overflow: "hidden" }}>
        {[
          { label: "Backlog", color: "rgba(255,255,255,0.3)", cards: [{ title: "Sentry error spike on /api/tasks", priority: "#f97316", tag: "High" }, { title: "Pagination for message history", priority: "#60a5fa", tag: null }] },
          { label: "In Progress", color: "#60a5fa", cards: [{ title: "Real-time updates via Pusher", priority: "#f97316", tag: "Urgent" }, { title: "Settings page", priority: "#60a5fa", tag: null }] },
          { label: "Done", color: "#22c55e", cards: [{ title: "Auth refactor", priority: null, tag: null, dim: true }, { title: "Workspace creation", priority: null, tag: null, dim: true }] },
        ].map(col => (
          <div key={col.label} style={{ flex: 1, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "7px 8px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: col.color }}>{col.label}</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{col.cards.length}</span>
            </div>
            <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
              {col.cards.map(card => (
                <div key={card.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "6px 7px", opacity: (card as any).dim ? 0.45 : 1 }}>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1.4, margin: "0 0 5px" }}>{card.title}</p>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {card.priority && <span style={{ width: 5, height: 5, borderRadius: "50%", background: card.priority }} />}
                    {card.tag && <span style={{ fontSize: 9, fontWeight: 600, color: card.tag === "Urgent" ? "#f97316" : "#fde047", background: card.tag === "Urgent" ? "rgba(249,115,22,0.12)" : "rgba(250,204,21,0.12)", border: `1px solid ${card.tag === "Urgent" ? "rgba(249,115,22,0.2)" : "rgba(250,204,21,0.2)"}`, borderRadius: 8, padding: "1px 5px" }}>{card.tag}</span>}
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
  const items = [
    { title: "v0.2 Launch — real-time + search", pct: 42, status: "In Progress", statusColor: "#60a5fa" },
    { title: "Message search across channels", pct: 80, status: "In Progress", statusColor: "#60a5fa" },
    { title: "GitHub PR events in channels", pct: 15, status: "Planned", statusColor: "rgba(255,255,255,0.25)" },
    { title: "Emoji reactions + @mentions", pct: 60, status: "In Progress", statusColor: "#60a5fa" },
  ]
  return (
    <MockupShell title="Roadmap">
      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 5 }}>
        {items.map(item => (
          <div key={item.title} style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, padding: "7px 10px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
            </div>
            <div style={{ width: 56, flexShrink: 0 }}>
              <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{ width: `${item.pct}%`, height: "100%", borderRadius: 2, background: "rgba(255,255,255,0.3)" }} />
              </div>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", margin: "2px 0 0", textAlign: "right" }}>{item.pct}%</p>
            </div>
            <span style={{ fontSize: 9, fontWeight: 600, color: item.statusColor, border: `1px solid ${item.statusColor === "#60a5fa" ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "2px 6px", flexShrink: 0, background: item.statusColor === "#60a5fa" ? "rgba(96,165,250,0.08)" : "rgba(255,255,255,0.04)" }}>
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
        {/* PR card */}
        <div style={{ border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><circle cx="3" cy="3" r="1.5" stroke="#22c55e" strokeWidth="1.2"/><circle cx="3" cy="9" r="1.5" stroke="#22c55e" strokeWidth="1.2"/><circle cx="9" cy="3" r="1.5" stroke="#22c55e" strokeWidth="1.2"/><path d="M3 4.5v3M4.5 3h2a2 2 0 0 1 2 2v0" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", margin: "0 0 2px" }}>feat: real-time channel updates via Pusher</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", margin: 0 }}>#142 opened by Jamie L. · into main</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "2px 7px", background: "rgba(34,197,94,0.08)" }}>● Open</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(165,180,251,0.8)", border: "1px solid rgba(165,180,251,0.15)", borderRadius: 8, padding: "2px 7px", background: "rgba(165,180,251,0.07)" }}>feature</span>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "2px 7px" }}>+312 −47</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[["#22c55e", "CI · build passed (2m 14s)"], ["#22c55e", "Tests · 94 passed, 0 failed"], ["#fbbf24", "1 review requested — Sarah K."]].map(([col, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: col, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Commit notification */}
        <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7, padding: "7px 10px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", flex: 1 }}>acme/backend · <strong style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>main</strong> — prod deploy succeeded</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>2m ago</span>
        </div>
      </div>
    </MockupShell>
  )
}

function GithubIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}
