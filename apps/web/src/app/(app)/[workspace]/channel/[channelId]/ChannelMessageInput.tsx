"use client"

import MessageInput from "@/components/messages/MessageInput"

type Props = {
  channelId: string
  placeholder?: string
}

export default function ChannelMessageInput({ channelId, placeholder }: Props) {
  const handleSend = async (content: string) => {
    const res = await fetch(`/api/channels/${channelId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    if (!res.ok) throw new Error("Failed to send message")
  }

  return <MessageInput placeholder={placeholder} onSend={handleSend} />
}
