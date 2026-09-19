import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function WorkspacePage({
  params,
}: {
  params: { workspace: string }
}) {
  const session = await auth()
  if (!session?.user) redirect("/signin")

  const workspace = await prisma.workspace.findUnique({
    where: { slug: params.workspace },
  })

  if (!workspace) redirect("/")

  const channel = await prisma.channel.findFirst({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "asc" },
  })

  if (channel) {
    redirect(`/${params.workspace}/channel/${channel.id}`)
  }

  // No channels yet
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-4xl">💬</div>
        <h2 className="text-xl font-semibold">No channels yet</h2>
        <p className="text-sm text-white/40">Create your first channel to start collaborating.</p>
        <a
          href={`/${params.workspace}/new-channel`}
          className="inline-block rounded-full bg-purple-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-600 transition-colors"
        >
          Create a channel
        </a>
      </div>
    </div>
  )
}
