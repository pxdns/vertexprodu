import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Image from "next/image"
import DMMessageInput from "./DMMessageInput"

export default async function DMPage({
  params,
}: {
  params: { workspace: string; userId: string }
}) {
  const session = await auth()
  if (!session?.user) redirect("/signin")

  const workspace = await prisma.workspace.findUnique({
    where: { slug: params.workspace },
  })
  if (!workspace) notFound()

  // Make sure both users are in workspace
  const [selfMember, otherMember] = await Promise.all([
    prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: workspace.id, userId: session.user.id } },
      include: { user: { select: { id: true, name: true, image: true } } },
    }),
    prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId: workspace.id, userId: params.userId } },
      include: { user: { select: { id: true, name: true, image: true } } },
    }),
  ])

  if (!selfMember || !otherMember) notFound()

  const recipient = otherMember.user

  const messages = await prisma.directMessage.findMany({
    where: {
      OR: [
        { senderId: session.user.id, recipientId: params.userId },
        { senderId: params.userId, recipientId: session.user.id },
      ],
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
    take: 100,
  })

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <header className="flex items-center gap-3 border-b border-white/8 px-6 py-3 flex-shrink-0">
        {recipient.image ? (
          <Image src={recipient.image} alt={recipient.name || ""} width={28} height={28} className="rounded-full" />
        ) : (
          <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/50">
            {(recipient.name || "?")[0].toUpperCase()}
          </div>
        )}
        <h1 className="font-semibold text-white">{recipient.name}</h1>
        <span className="text-xs text-white/30">Direct message</span>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <div className="flex flex-1 h-full items-center justify-center">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                {recipient.image ? (
                  <Image src={recipient.image} alt="" width={56} height={56} className="rounded-full" />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-purple-500/20 flex items-center justify-center text-xl font-semibold text-purple-300">
                    {(recipient.name || "?")[0].toUpperCase()}
                  </div>
                )}
              </div>
              <p className="font-semibold text-white">{recipient.name}</p>
              <p className="text-sm text-white/40">This is the beginning of your conversation.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg) => {
              const isOwn = msg.senderId === session.user.id
              return (
                <div
                  key={msg.id}
                  className="group flex gap-3 px-6 py-0.5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-9 flex-shrink-0 pt-0.5">
                    {msg.sender.image ? (
                      <Image src={msg.sender.image} alt="" width={36} height={36} className="rounded-full" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white/50">
                        {(msg.sender.name || "?")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-white">
                        {isOwn ? "You" : msg.sender.name || "Unknown"}
                      </span>
                      <span className="text-xs text-white/30">
                        {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Input */}
      <DMMessageInput
        recipientId={params.userId}
        placeholder={`Message ${recipient.name}`}
      />
    </div>
  )
}
