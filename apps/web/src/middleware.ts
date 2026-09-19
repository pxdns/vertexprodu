import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  const publicPaths = ["/signin"]
  const isPublic = publicPaths.some((p) => pathname.startsWith(p))

  // Use x-forwarded-host to get the real origin on Vercel,
  // bypassing NextAuth's AUTH_URL override of req.url/req.nextUrl
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3000"
  const proto = req.headers.get("x-forwarded-proto") ?? "https"
  const origin = `${proto}://${host}`

  if (!isAuthenticated && !isPublic) {
    return NextResponse.redirect(`${origin}/signin`)
  }

  if (isAuthenticated && pathname === "/signin") {
    return NextResponse.redirect(`${origin}/`)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
