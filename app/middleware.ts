// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isAuthPage = pathname.startsWith("/auth");

  if (!token && !isAuthPage) {
    // No token and accessing protected route -> redirect login
    const url = req.nextUrl.clone();
    // url.pathname = "/auth/Login";
    return NextResponse.redirect(url);
  }

  if (token && isAuthPage) {
    // Already logged in but trying to access auth pages -> redirect profile/home
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
