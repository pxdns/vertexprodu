import Image from "next/image"

type Reaction = { id: string; emoji: string; userId: string }

type Message = {
  id: string
  content: string
  createdAt: Date
  editedAt: Date | null
  user: { id: string; name: string | null; image: string | null }
  reactions: Reaction[]
}

type Props = {
  messages: Message[]
  currentUserId: string
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function formatDate(date: Date) {
  const d = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return "Today"
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

export default function MessageList({ messages, currentUserId }: Props) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-white/30">No messages yet. Say hello!</p>
      </div>
    )
  }

  // Group messages by date
  const groups: { date: string; messages: Message[] }[] = []
  for (const msg of messages) {
    const dateStr = formatDate(msg.createdAt)
    const last = groups[groups.length - 1]
    if (last && last.date === dateStr) {
      last.messages.push(msg)
    } else {
      groups.push({ date: dateStr, messages: [msg] })
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {groups.map((group) => (
        <div key={group.date}>
          {/* Date divider */}
          <div className="flex items-center gap-3 px-6 py-3">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-xs font-medium text-white/30">{group.date}</span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          {/* Messages in this date group */}
          {group.messages.map((msg, i) => {
            const prevMsg = group.messages[i - 1]
            const isGrouped =
              prevMsg &&
              prevMsg.user.id === msg.user.id &&
              new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 5 * 60 * 1000

            return (
              <div
                key={msg.id}
                className="group flex gap-3 px-6 py-0.5 hover:bg-white/[0.02] transition-colors"
              >
                {/* Avatar column */}
                <div className="w-9 flex-shrink-0 pt-0.5">
                  {!isGrouped && (
                    msg.user.image ? (
                      <Image
                        src={msg.user.image}
                        alt={msg.user.name || ""}
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-purple-500/20 flex items-center justify-center text-sm font-semibold text-purple-300">
                        {(msg.user.name || "?")[0].toUpperCase()}
                      </div>
                    )
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {!isGrouped && (
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-white">
                        {msg.user.name || "Unknown"}
                        {msg.user.id === currentUserId && (
                          <span className="ml-1 text-[10px] font-normal text-white/30">(you)</span>
                        )}
                      </span>
                      <span className="text-xs text-white/30">{formatTime(msg.createdAt)}</span>
                      {msg.editedAt && (
                        <span className="text-[10px] text-white/20 italic">(edited)</span>
                      )}
                    </div>
                  )}
                  <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>

                  {/* Reactions */}
                  {msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(
                        msg.reactions.reduce((acc, r) => {
                          acc[r.emoji] = (acc[r.emoji] || 0) + 1
                          return acc
                        }, {} as Record<string, number>)
                      ).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs transition-colors hover:bg-white/10"
                        >
                          <span>{emoji}</span>
                          <span className="text-white/50">{count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover timestamp for grouped messages */}
                {isGrouped && (
                  <span className="hidden group-hover:block text-[10px] text-white/20 self-center flex-shrink-0 w-9 text-right">
                    {formatTime(msg.createdAt).split(" ")[0]}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
