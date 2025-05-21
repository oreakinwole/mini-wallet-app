import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname

    // Define public paths that don't require authentication
    const isPublicPath = path === '/login' || path === '/register' || path === '/'

    // Check if user is authenticated by looking for the token in cookies
    const token = request.cookies.get('token')?.value || ''

    // Redirect logic
    if (isPublicPath && token) {
        // If user is on a public path but is authenticated, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!isPublicPath && !token && !path.startsWith('/payment-callback')) {
        // If user is not on a public path and is not authenticated, redirect to login
        // Exception for payment callback which might be accessed via redirect from payment provider
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/login', '/register', '/dashboard/:path*', '/payment-callback'],
}
