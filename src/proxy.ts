import { NextResponse, type NextRequest } from "next/server";
import { DASHBOARD_COOKIE_NAME, getDashboardAccessKey } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const session = request.cookies.get(DASHBOARD_COOKIE_NAME)?.value;

  if (session === getDashboardAccessKey()) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
