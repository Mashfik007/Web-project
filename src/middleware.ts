import { dashboardPath } from "@/Helper/roleHome";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

function tokenUser(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { _id?: unknown; isAdmin?: unknown };
    if (typeof json._id !== "string" || !json._id) return null;
    return { id: json._id, isAdmin: json.isAdmin === true };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("accessToken")?.value;
  const session = token ? tokenUser(token) : null;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const isPublic = pathname === "/" || pathname === "/login" || pathname === "/signup";

  if (isPublic && session) {
    return NextResponse.redirect(
      new URL(dashboardPath(session.id, session.isAdmin), request.url),
    );
  }

  if ((pathname.startsWith("/user") || pathname.startsWith("/admin")) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && pathname.startsWith("/admin") && !session.isAdmin) {
    return NextResponse.redirect(new URL(`/user/${session.id}`, request.url));
  }

  if (session && pathname.startsWith("/user") && session.isAdmin) {
    return NextResponse.redirect(new URL(`/admin/${session.id}`, request.url));
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/", "/login", "/signup", "/user/:path*", "/admin/:path*"],
};
