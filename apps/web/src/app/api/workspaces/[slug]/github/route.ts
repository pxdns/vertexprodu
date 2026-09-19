import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const workspace = await prisma.workspace.findUnique({ where: { slug: params.slug } })
  if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: session.user.id } },
  })
  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { repoOwner, repoName } = await req.json()
  if (!repoOwner?.trim() || !repoName?.trim()) {
    return NextResponse.json({ error: "repoOwner and repoName are required" }, { status: 400 })
  }

  const integration = await prisma.gitHubIntegration.upsert({
    where: { workspaceId: workspace.id },
    create: { workspaceId: workspace.id, repoOwner: repoOwner.trim(), repoName: repoName.trim() },
    update: { repoOwner: repoOwner.trim(), repoName: repoName.trim() },
  })

  return NextResponse.json(integration)
}
