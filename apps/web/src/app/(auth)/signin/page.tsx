"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function SignInPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleOAuth = async (provider: "github" | "google") => {
    setLoading(provider)
    await signIn(provider, { callbackUrl: "/" })
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d0d0d]">
      {/* ── Left branding half ─────────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-14 overflow-hidden">
        {/* Blob backgrounds */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-900/10 blur-[100px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">Vertex</span>
        </div>

        {/* Hero */}
        <div className="relative z-10 space-y-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-purple-400">
            Welcome to Vertex
          </p>
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Build together,
            <br />
            <span className="font-light italic text-white/60">ship faster.</span>
          </h1>
          <p className="max-w-sm text-base text-white/40 leading-relaxed">
            Channels, tasks, roadmap, and GitHub — everything your engineering team needs, in one lightweight workspace.
          </p>

          {/* Testimonial */}
          <div className="mt-8 rounded-xl border border-white/8 bg-white/5 p-5 backdrop-blur-md max-w-sm">
            <p className="text-sm text-white/70 leading-relaxed">
              &ldquo;Vertex replaced our Slack + Linear setup. The GitHub integration is seamless — PRs surface right inside the channel.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
              <div>
                <p className="text-xs font-semibold text-white">Sarah K.</p>
                <p className="text-xs text-white/40">Engineering Lead, Acme</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/20">
          © {new Date().getFullYear()} Vertex. All rights reserved.
        </div>
      </div>

      {/* ── Right form half ────────────────────────────────────── */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-base font-semibold tracking-tight">Vertex</span>
          </div>

          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Sign in</h2>
            <p className="mt-2 text-sm text-white/50">
              Sign in with your existing account below.
            </p>
          </div>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleOAuth("github")}
              disabled={!!loading}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              {loading === "github" ? "Connecting..." : "Continue with GitHub"}
            </button>

            <button
              onClick={() => handleOAuth("google")}
              disabled={!!loading}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {loading === "google" ? "Connecting..." : "Continue with Google"}
            </button>
          </div>

          <p className="text-center text-xs text-white/20">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
