import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { owner: string; repo: string } }
) {
  const res = await fetch(
    `https://api.github.com/repos/${params.owner}/${params.repo}/pulls?state=all&per_page=30`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 60 },
    }
  )

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch pull requests" }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
