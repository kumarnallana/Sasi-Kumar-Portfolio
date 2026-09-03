import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.github.com/users/kumarnallana/repos?per_page=100&sort=updated", {
      headers: process.env.GITHUB_TOKEN ? {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      } : {},
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) throw new Error("Failed to fetch repos");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load repos" }, { status: 500 });
  }
}
