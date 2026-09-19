import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 })

  const base = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 48)

  const existing = await prisma.workspace.findUnique({ where: { slug: base } })
  const slug = existing ? `${base}-${Date.now().toString(36)}` : base

  const workspace = await prisma.workspace.create({
    data: {
      name: name.trim(),
      slug,
      members: { create: { userId: session.user.id, role: "OWNER" } },
      channels: {
        create: [
          { name: "general", description: "General discussion" },
          { name: "engineering", description: "Engineering talk" },
        ],
      },
    },
  })

  return NextResponse.json(workspace, { status: 201 })
}
