import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  const images = Array.from({length:5}).map((_,i)=>`https://source.unsplash.com/600x800/?${q}&sig=${i}`)
  return NextResponse.json({status:true, images})
}
