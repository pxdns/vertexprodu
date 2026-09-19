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

  const { name, description } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 })

  const existing = await prisma.channel.findUnique({
    where: { workspaceId_name: { workspaceId: workspace.id, name: name.trim() } },
  })
  if (existing) return NextResponse.json({ error: "Channel already exists" }, { status: 409 })

  const channel = await prisma.channel.create({
    data: { name: name.trim(), description: description?.trim() || null, workspaceId: workspace.id },
  })

  return NextResponse.json(channel, { status: 201 })
}
