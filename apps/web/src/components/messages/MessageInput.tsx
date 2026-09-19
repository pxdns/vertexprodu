"use client"

import type { KeyboardEvent, ReactNode } from "react"
import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"

type Props = {
  placeholder?: string
  onSend: (content: string) => Promise<void>
}

export default function MessageInput({ placeholder = "Send a message", onSend }: Props) {
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  const adjustHeight = () => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px"
  }

  const handleSend = useCallback(async () => {
    const trimmed = content.trim()
    if (!trimmed || sending) return
    setSending(true)
    try {
      await onSend(trimmed)
      setContent("")
      if (textareaRef.current) textareaRef.current.style.height = "auto"
      router.refresh()
    } finally {
      setSending(false)
    }
  }, [content, sending, onSend, router])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const insertFormat = (before: string, after: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = content.slice(start, end)
    const newContent =
      content.slice(0, start) + before + selected + after + content.slice(end)
    setContent(newContent)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  return (
    <div className="mx-4 mb-4 rounded-xl border border-white/10 bg-white/5 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all">
      {/* Formatting toolbar */}
      <div className="flex items-center gap-0.5 border-b border-white/8 px-3 py-2">
        <ToolbarButton onClick={() => insertFormat("**", "**")} title="Bold">
          <span className="font-bold text-xs">B</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => insertFormat("_", "_")} title="Italic">
          <span className="italic text-xs">I</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => insertFormat("`", "`")} title="Code">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M4 3.5L1.5 6.5 4 9.5M9 3.5L11.5 6.5 9 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ToolbarButton>
        <div className="mx-1 h-4 w-px bg-white/10" />
        <ToolbarButton onClick={() => insertFormat("```\n", "\n```")} title="Code block">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="1.5" y="2.5" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3.5 5.5L5 7l-1.5 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.5 8h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </ToolbarButton>
        <ToolbarButton title="Attach">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M10.5 6.5l-4.5 4.5a3 3 0 0 1-4.243-4.243L6.5 2.5a2 2 0 0 1 2.828 2.828L5.5 9.157a1 1 0 0 1-1.414-1.414L8 3.83" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ToolbarButton>
      </div>

      {/* Textarea */}
      <div className="flex items-end gap-2 px-3 py-3">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => { setContent(e.target.value); adjustHeight() }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-white/30 outline-none leading-relaxed"
          style={{ maxHeight: 200 }}
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || sending}
          className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500 text-white transition-colors hover:bg-purple-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M11.5 1.5L6 7M11.5 1.5L8 11.5L6 7M11.5 1.5L1.5 5L6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function ToolbarButton({
  children,
  onClick,
  title,
}: {
  children: ReactNode
  onClick?: () => void
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex h-6 w-6 items-center justify-center rounded text-white/30 transition-colors hover:bg-white/8 hover:text-white/60"
    >
      {children}
    </button>
  )
}
