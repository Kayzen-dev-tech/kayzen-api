import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get("url")
  if (!url) return NextResponse.json({status:false})
  return NextResponse.json({
    status:true,
    service:"tikwm",
    url
  })
}
