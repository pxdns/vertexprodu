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

  // Only owners/admins can invite
  const requester = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: session.user.id } },
  })
  if (!requester || (requester.role !== "OWNER" && requester.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { email } = await req.json()
  if (!email?.trim()) return NextResponse.json({ error: "Email is required" }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: email.trim() } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const existing = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
  })
  if (existing) return NextResponse.json({ error: "User is already a member" }, { status: 409 })

  const member = await prisma.workspaceMember.create({
    data: { workspaceId: workspace.id, userId: user.id, role: "MEMBER" },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  })

  return NextResponse.json(member, { status: 201 })
}
