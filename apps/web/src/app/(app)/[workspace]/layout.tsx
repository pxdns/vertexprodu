import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Sidebar from "@/components/sidebar/Sidebar"

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspace: string }
}) {
  const session = await auth()
  if (!session?.user) redirect("/signin")

  const workspace = await prisma.workspace.findUnique({
    where: { slug: params.workspace },
  })

  if (!workspace) notFound()

  // Verify membership
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: session.user.id,
      },
    },
  })

  if (!membership) notFound()

  const [channels, members] = await Promise.all([
    prisma.channel.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.workspaceMember.findMany({
      where: { workspaceId: workspace.id },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { joinedAt: "asc" },
    }),
  ])

  return (
    <div className="flex h-screen bg-[#0d0d0d] overflow-hidden">
      <Sidebar
        workspace={workspace}
        channels={channels}
        members={members}
        currentUserId={session.user.id}
        currentUserName={session.user.name ?? null}
        currentUserImage={session.user.image ?? null}
      />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
