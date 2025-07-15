import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Allow public files and Next.js internals without redirect
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Auth pages allowed when no token
  const isAuthPage =
    pathname === "/auth/Login" || pathname === "/auth/Register" || pathname.startsWith("/auth/");

  // If user tries to access auth pages but already has token -> redirect to home
  if (token && isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // If no token and user tries to access any protected page (not /auth/login or /auth/register) -> redirect to login
  if (!token && !isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/Login";
        url.pathname = "/auth/Register"; // Adjust if you have a register page

    return NextResponse.redirect(url);
  }

  // Otherwise allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     Apply middleware to all routes except static files, api routes, and Next.js internals.
     Adjust as needed for your project structure.
    */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
