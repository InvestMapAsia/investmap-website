import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

function loginRedirect(request: NextRequest) {
  const url = new URL("/login", request.url);
  url.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.role as string | undefined;
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return loginRedirect(request);
    }
  }

  if (pathname.startsWith("/cabinet/owner") || pathname.startsWith("/owner")) {
    if (!role || (role !== "OWNER" && role !== "ADMIN")) {
      return loginRedirect(request);
    }
  }

  if (pathname.startsWith("/cabinet/investor")) {
    if (!token) {
      return loginRedirect(request);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cabinet/:path*", "/owner/:path*"],
};
