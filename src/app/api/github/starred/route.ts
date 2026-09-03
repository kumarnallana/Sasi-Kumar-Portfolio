import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.github.com/users/kumarnallana/starred?per_page=100", {
      headers: process.env.GITHUB_TOKEN ? {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      } : {},
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) throw new Error("Failed to fetch starred repos");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load starred repos" }, { status: 500 });
  }
}
