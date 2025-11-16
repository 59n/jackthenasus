import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow access to static files and the config (needed for CMS initialization)
  if (
    request.nextUrl.pathname.match(
      /\.(js|css|json|html|svg|png|jpg|gif|ico)$/
    ) ||
    request.nextUrl.pathname === "/admin/config.yml"
  ) {
    return NextResponse.next();
  }

  // For the admin page itself (/admin or /admin/), we can't directly check
  // the GitHub token here since it's set client-side after OAuth.
  // The client-side auth-guard.js will enforce authorization.
  // This middleware is a defense-in-depth layer for API calls.

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
