import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const messages = await prisma.message.findMany({
    where: { channelId: params.channelId },
    include: {
      user: { select: { id: true, name: true, image: true } },
      reactions: true,
    },
    orderBy: { createdAt: "asc" },
    take: 100,
  })

  return NextResponse.json(messages)
}

export async function POST(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const channel = await prisma.channel.findUnique({ where: { id: params.channelId } })
  if (!channel) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Verify user is a workspace member
  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: channel.workspaceId, userId: session.user.id } },
  })
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: "Content is required" }, { status: 400 })

  const message = await prisma.message.create({
    data: { content: content.trim(), channelId: params.channelId, userId: session.user.id },
    include: {
      user: { select: { id: true, name: true, image: true } },
      reactions: true,
    },
  })

  return NextResponse.json(message, { status: 201 })
}
