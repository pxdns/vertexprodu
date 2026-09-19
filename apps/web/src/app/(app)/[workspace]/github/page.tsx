import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"

export default async function GitHubPage({
  params,
}: {
  params: { workspace: string }
}) {
  const session = await auth()
  if (!session?.user) redirect("/signin")

  const workspace = await prisma.workspace.findUnique({
    where: { slug: params.workspace },
  })
  if (!workspace) notFound()

  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: session.user.id,
      },
    },
  })
  if (!membership) notFound()

  const integration = await prisma.gitHubIntegration.findUnique({
    where: { workspaceId: workspace.id },
  })

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <header className="flex items-center justify-between border-b border-white/8 px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/60">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <h1 className="font-semibold text-white">GitHub</h1>
        </div>
        {integration && (
          <span className="flex items-center gap-1.5 text-xs text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Connected
          </span>
        )}
      </header>

      <div className="flex-1 px-6 py-8 space-y-8 max-w-2xl">
        {integration ? (
          <>
            {/* Connected state */}
            <section className="space-y-4">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-white/30">
                Connected repository
              </h2>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white/40">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span className="text-sm font-medium text-white">
                    {integration.repoOwner}/{integration.repoName}
                  </span>
                </div>
                <p className="text-xs text-white/40">
                  Webhook events from this repository will be posted to your channels.
                </p>
              </div>
            </section>

            {/* Coming soon features */}
            <section className="space-y-4">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-white/30">
                Coming soon
              </h2>
              <div className="space-y-2">
                {[
                  "PR events posted to a channel when opened, merged, or closed",
                  "Commit push notifications with branch and author info",
                  "Rich PR link previews in messages",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
                  >
                    <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500/40" />
                    <p className="text-sm text-white/50">{feature}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Not connected state */}
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white/40">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Connect a repository</h2>
                <p className="mt-2 text-sm text-white/40 max-w-sm">
                  Link a GitHub repository to get PR events and commits posted directly into your channels.
                </p>
              </div>
              <div className="w-full max-w-sm rounded-xl border border-white/8 bg-white/[0.03] p-5 text-left space-y-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-white/30">Repository</p>
                <div className="flex gap-2">
                  <input
                    disabled
                    placeholder="owner"
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/40 placeholder:text-white/20 outline-none"
                  />
                  <span className="flex items-center text-white/20">/</span>
                  <input
                    disabled
                    placeholder="repo"
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/40 placeholder:text-white/20 outline-none"
                  />
                </div>
                <button
                  disabled
                  className="w-full rounded-full bg-purple-500/50 px-4 py-2.5 text-sm font-semibold text-white/50 cursor-not-allowed"
                >
                  Connect — coming soon
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
