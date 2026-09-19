import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import MessageList from "@/components/messages/MessageList"
import ChannelMessageInput from "./ChannelMessageInput"

export default async function ChannelPage({
  params,
}: {
  params: { workspace: string; channelId: string }
}) {
  const session = await auth()
  if (!session?.user) redirect("/signin")

  const workspace = await prisma.workspace.findUnique({
    where: { slug: params.workspace },
  })
  if (!workspace) notFound()

  const channel = await prisma.channel.findFirst({
    where: { id: params.channelId, workspaceId: workspace.id },
  })
  if (!channel) notFound()

  const memberCount = await prisma.workspaceMember.count({
    where: { workspaceId: workspace.id },
  })

  const messages = await prisma.message.findMany({
    where: { channelId: channel.id },
    include: {
      user: { select: { id: true, name: true, image: true } },
      reactions: true,
    },
    orderBy: { createdAt: "asc" },
    take: 100,
  })

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-white/8 px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-lg">#</span>
          <h1 className="font-semibold text-white">{channel.name}</h1>
          {channel.description && (
            <>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <p className="text-sm text-white/40 truncate max-w-xs">{channel.description}</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30">
            <span className="text-white/50">{memberCount}</span> members
          </span>
          <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60 hover:bg-white/8 transition-colors">
            Search
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4">
        <MessageList messages={messages} currentUserId={session.user.id} />
      </div>

      {/* Input */}
      <ChannelMessageInput
        channelId={channel.id}
        placeholder={`Message #${channel.name}`}
      />
    </div>
  )
}
