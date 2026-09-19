import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"

export default async function SettingsPage({
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

  const members = await prisma.workspaceMember.findMany({
    where: { workspaceId: workspace.id },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
    orderBy: { joinedAt: "asc" },
  })

  const isOwner = membership.role === "OWNER"

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <header className="flex items-center border-b border-white/8 px-6 py-3 flex-shrink-0">
        <h1 className="font-semibold text-white">Settings</h1>
      </header>

      <div className="flex-1 px-6 py-8 space-y-10 max-w-2xl">
        {/* Workspace info */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-white/30">
            Workspace
          </h2>
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5 space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-white/40">Name</p>
              <p className="text-sm text-white font-medium">{workspace.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/40">URL slug</p>
              <p className="text-sm text-white/60 font-mono">{workspace.slug}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/40">Your role</p>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/60">
                {membership.role}
              </span>
            </div>
          </div>
        </section>

        {/* Members */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-white/30">
            Members · {members.length}
          </h2>
          <div className="rounded-xl border border-white/8 overflow-hidden">
            {members.map((m, i) => (
              <div
                key={m.id}
                className={`flex items-center gap-3 px-4 py-3 ${
                  i < members.length - 1 ? "border-b border-white/8" : ""
                }`}
              >
                {m.user.image ? (
                  <img
                    src={m.user.image}
                    alt={m.user.name || ""}
                    width={28}
                    height={28}
                    className="rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-semibold text-purple-300 flex-shrink-0">
                    {(m.user.name || "?")[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{m.user.name || "Unknown"}</p>
                  <p className="text-xs text-white/40 truncate">{m.user.email}</p>
                </div>
                <span className="flex-shrink-0 text-xs text-white/30 font-medium">{m.role}</span>
                {m.user.id === session.user.id && (
                  <span className="text-[10px] text-white/20">(you)</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Danger zone — owner only */}
        {isOwner && (
          <section className="space-y-4">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-red-400/60">
              Danger zone
            </h2>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">Delete workspace</p>
                  <p className="text-xs text-white/40 mt-1">
                    Permanently delete this workspace and all its data. This cannot be undone.
                  </p>
                </div>
                <button
                  disabled
                  className="flex-shrink-0 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 opacity-50 cursor-not-allowed"
                  title="Coming soon"
                >
                  Delete workspace
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
