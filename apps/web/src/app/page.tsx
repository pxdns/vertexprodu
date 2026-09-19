import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import LandingPage from "@/components/landing/LandingPage"

export default async function RootPage() {
  const session = await auth()

  // Authenticated → send to workspace
  if (session?.user) {
    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id },
      include: { workspace: true },
      orderBy: { joinedAt: "asc" },
    })

    if (!membership) {
      redirect("/new-workspace")
    }

    const channel = await prisma.channel.findFirst({
      where: { workspaceId: membership.workspace.id },
      orderBy: { createdAt: "asc" },
    })

    if (channel) {
      redirect(`/${membership.workspace.slug}/channel/${channel.id}`)
    }

    redirect(`/${membership.workspace.slug}`)
  }

  // Unauthenticated → marketing landing page
  return <LandingPage />
}
