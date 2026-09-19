"use client"

import MessageInput from "@/components/messages/MessageInput"

type Props = {
  recipientId: string
  placeholder?: string
}

export default function DMMessageInput({ recipientId, placeholder }: Props) {
  const handleSend = async (content: string) => {
    const res = await fetch(`/api/dm/${recipientId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    if (!res.ok) throw new Error("Failed to send message")
  }

  return <MessageInput placeholder={placeholder} onSend={handleSend} />
}
