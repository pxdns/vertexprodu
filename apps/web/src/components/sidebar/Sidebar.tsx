"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import Image from "next/image"

type Channel = { id: string; name: string }
type Member = { user: { id: string; name: string | null; image: string | null } }

type Props = {
  workspace: { id: string; name: string; slug: string }
  channels: Channel[]
  members: Member[]
  currentUserId: string
  currentUserName: string | null
  currentUserImage: string | null
}

export default function Sidebar({
  workspace,
  channels,
  members,
  currentUserId,
  currentUserName,
  currentUserImage,
}: Props) {
  const pathname = usePathname()

  const isChannelActive = (id: string) =>
    pathname === `/${workspace.slug}/channel/${id}`

  const isDMActive = (userId: string) =>
    pathname === `/${workspace.slug}/dm/${userId}`

  const navActive = (path: string) => pathname === `/${workspace.slug}/${path}`

  return (
    <aside className="flex h-screen w-[240px] flex-shrink-0 flex-col border-r border-white/8 bg-[#0d0d0d]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500 flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" />
            </svg>
          </div>
          <span className="text-sm font-semibold truncate">{workspace.name}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/30 flex-shrink-0">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <Link
          href={`/${workspace.slug}/settings`}
          className="rounded-md p-1 text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M12.4 9a1 1 0 0 0 .2 1.1l.04.04a1.2 1.2 0 0 1-1.7 1.7l-.04-.04a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.92V12.5a1.2 1.2 0 0 1-2.4 0v-.08A1 1 0 0 0 6.1 11.5a1 1 0 0 0-1.1.2l-.04.04a1.2 1.2 0 0 1-1.7-1.7l.04-.04A1 1 0 0 0 3.5 9a1 1 0 0 0-.92-.6H2.5a1.2 1.2 0 0 1 0-2.4h.08A1 1 0 0 0 3.5 5.4a1 1 0 0 0-.2-1.1l-.04-.04a1.2 1.2 0 0 1 1.7-1.7l.04.04A1 1 0 0 0 6.1 2.8a1 1 0 0 0 .6-.92V1.8a1.2 1.2 0 0 1 2.4 0v.08A1 1 0 0 0 9.9 2.8a1 1 0 0 0 1.1-.2l.04-.04a1.2 1.2 0 0 1 1.7 1.7l-.04.04A1 1 0 0 0 12.5 5.4a1 1 0 0 0 .92.6h.08a1.2 1.2 0 0 1 0 2.4h-.08A1 1 0 0 0 12.4 9Z" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </Link>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        {/* Channels */}
        <section>
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-white/30">
              Channels
            </span>
            <Link
              href={`/${workspace.slug}/new-channel`}
              className="rounded p-0.5 text-white/30 transition-colors hover:text-white/60 hover:bg-white/5"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
          <ul className="space-y-0.5">
            {channels.map((ch) => (
              <li key={ch.id}>
                <Link
                  href={`/${workspace.slug}/channel/${ch.id}`}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                    isChannelActive(ch.id)
                      ? "bg-white/10 text-white border-l-2 border-purple-500 rounded-l-none"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  <span className="text-white/30">#</span>
                  <span className="truncate">{ch.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Direct Messages */}
        <section>
          <div className="px-2 mb-1">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-white/30">
              Direct Messages
            </span>
          </div>
          <ul className="space-y-0.5">
            {members
              .filter((m) => m.user.id !== currentUserId)
              .map((m) => (
                <li key={m.user.id}>
                  <Link
                    href={`/${workspace.slug}/dm/${m.user.id}`}
                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                      isDMActive(m.user.id)
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:bg-white/5 hover:text-white/80"
                    }`}
                  >
                    <span className="relative flex-shrink-0">
                      {m.user.image ? (
                        <Image
                          src={m.user.image}
                          alt={m.user.name || ""}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/50">
                          {(m.user.name || "?")[0].toUpperCase()}
                        </div>
                      )}
                      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success border border-[#0d0d0d]" />
                    </span>
                    <span className="truncate">{m.user.name}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>

        {/* Navigation */}
        <section className="border-t border-white/8 pt-3">
          {[
            {
              path: "tasks",
              label: "Tasks",
              icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1.5" y="1.5" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              path: "roadmap",
              label: "Roadmap",
              icon: (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1.5 10.5L4 5.5L7 9L10 3.5L12.5 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              path: "github",
              label: "GitHub",
              icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              ),
            },
          ].map(({ path, label, icon }) => (
            <Link
              key={path}
              href={`/${workspace.slug}/${path}`}
              className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors mb-0.5 ${
                navActive(path)
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <span className="text-white/40">{icon}</span>
              {label}
            </Link>
          ))}
        </section>
      </nav>

      {/* User footer */}
      <div className="flex items-center gap-2.5 border-t border-white/8 px-3 py-3">
        {currentUserImage ? (
          <Image
            src={currentUserImage}
            alt={currentUserName || ""}
            width={28}
            height={28}
            className="rounded-full flex-shrink-0"
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-purple-500/30 flex items-center justify-center text-xs font-semibold text-purple-300 flex-shrink-0">
            {(currentUserName || "?")[0].toUpperCase()}
          </div>
        )}
        <span className="flex-1 truncate text-sm text-white/70">{currentUserName}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="rounded p-1 text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
          title="Sign out"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2H2.5A1.5 1.5 0 0 0 1 3.5v7A1.5 1.5 0 0 0 2.5 12H5M9.5 10l2.5-3-2.5-3M12 7H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  )
}
