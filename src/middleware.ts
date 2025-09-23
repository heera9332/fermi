// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const pathname = url.pathname // e.g. "/posts"
  const firstSegment = pathname.split('/').filter(Boolean)[0] // "posts"

  const response = NextResponse.next()
  response.headers.set('x-route-name', firstSegment || 'home')
  return response
}
