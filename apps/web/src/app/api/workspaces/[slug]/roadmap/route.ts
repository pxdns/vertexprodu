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
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { title, description, type, status, targetDate, progress } = await req.json()
  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 })

  const item = await prisma.roadmapItem.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      type: type || "FEATURE",
      status: status || "PLANNED",
      workspaceId: workspace.id,
      targetDate: targetDate ? new Date(targetDate) : null,
      progress: progress || 0,
    },
  })

  return NextResponse.json(item, { status: 201 })
}
