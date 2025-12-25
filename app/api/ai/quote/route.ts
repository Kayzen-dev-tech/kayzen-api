import { NextResponse } from "next/server"

export async function GET() {
  const data = [
    "Jangan menyerah",
    "Tetap melangkah",
    "Hari esok lebih baik"
  ]
  return NextResponse.json({result:data[Math.floor(Math.random()*data.length)]})
}
