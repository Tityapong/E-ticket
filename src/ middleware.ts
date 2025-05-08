import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/register"

  // Get the token from cookies
  const token = request.cookies.get("authToken")?.value || ""

  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and tries to access login/register page, redirect to home
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected route, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/profile/:path*",
    // Add other protected routes here
  ],
}
