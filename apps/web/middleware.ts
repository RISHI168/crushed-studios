// NextAuth middleware for protecting routes
import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/project']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route should be protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtected) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      const signInUrl = new URL('/auth/login', request.url)
      signInUrl.searchParams.set('callbackUrl', encodeURI(request.url))
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/project/:path*'],
}
