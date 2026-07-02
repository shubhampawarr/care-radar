import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only redirect the root homepage.
  // Do not interfere with /en, /de, or manually selected language pages.
  if (pathname !== "/") {
    return NextResponse.next();
  }

  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();

  const url = request.nextUrl.clone();

  // Germany visitors go to German site.
  // Everyone else goes to English site.
  url.pathname = country === "DE" ? "/de" : "/en";

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/"],
};