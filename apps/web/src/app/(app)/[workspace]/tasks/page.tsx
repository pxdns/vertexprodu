import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import TaskBoard from "@/components/tasks/TaskBoard"

export default async function TasksPage({
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

  const [tasks, members] = await Promise.all([
    prisma.task.findMany({
      where: { workspaceId: workspace.id },
      include: {
        assignee: { select: { id: true, name: true, image: true } },
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.workspaceMember.findMany({
      where: { workspaceId: workspace.id },
      include: { user: { select: { id: true, name: true, image: true } } },
    }),
  ])

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between border-b border-white/8 px-6 py-3 flex-shrink-0">
        <h1 className="font-semibold text-white">Tasks</h1>
        <span className="text-xs text-white/30">{tasks.length} total</span>
      </header>
      <div className="flex-1 overflow-hidden">
        <TaskBoard
          workspaceSlug={params.workspace}
          initialTasks={tasks}
          members={members.map((m) => m.user)}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  )
}
