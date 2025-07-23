import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Read the JSON file from the public folder at runtime.
    const filePath = path.join(process.cwd(), "public", "analysis_result.json")
    const raw = await fs.readFile(filePath, "utf8")
    const data = JSON.parse(raw)

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error("/api/analysis error:", err)
    return NextResponse.json({ error: "Failed to load analysis data" }, { status: 500 })
  }
}
