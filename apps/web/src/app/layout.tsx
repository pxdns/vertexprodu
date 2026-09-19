import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Vertex — Build together, ship faster",
  description: "Team workspace for engineers. Channels, tasks, roadmap, and GitHub — all in one place.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0d0d0d] text-white antialiased">{children}</body>
    </html>
  )
}
