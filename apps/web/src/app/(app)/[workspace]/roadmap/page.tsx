import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import RoadmapView from "@/components/roadmap/RoadmapView"

export default async function RoadmapPage({
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

  const items = await prisma.roadmapItem.findMany({
    where: { workspaceId: workspace.id },
    orderBy: [{ type: "asc" }, { targetDate: "asc" }, { createdAt: "desc" }],
  })

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between border-b border-white/8 px-6 py-3 flex-shrink-0">
        <h1 className="font-semibold text-white">Roadmap</h1>
        <span className="text-xs text-white/30">{items.length} items</span>
      </header>
      <div className="flex-1 overflow-y-auto">
        <RoadmapView workspaceSlug={params.workspace} initialItems={items} />
      </div>
    </div>
  )
}
