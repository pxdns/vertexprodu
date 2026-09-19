import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (session.user.id === params.userId) {
    return NextResponse.json({ error: "Cannot DM yourself" }, { status: 400 })
  }

  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: "Content is required" }, { status: 400 })

  const message = await prisma.directMessage.create({
    data: {
      content: content.trim(),
      senderId: session.user.id,
      recipientId: params.userId,
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
    },
  })

  return NextResponse.json(message, { status: 201 })
}
