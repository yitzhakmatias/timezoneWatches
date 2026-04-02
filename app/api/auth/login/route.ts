import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  let data: any
  try {
    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    data = await res.json()
    if (!res.ok) return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: 'API server unreachable' }, { status: 503 })
  }

  const response = NextResponse.json({ user: data.user })
  response.cookies.set('auth_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
  return response
}
