import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();
  console.log("session", session);

  // 🟢 Redirect to login if no session for protected routes
  if (
    ["/profile", "/admin"].some((path) =>
      req.nextUrl.pathname.startsWith(path)
    ) &&
    !session
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🟢 /admin → only admins allowed
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (session?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 🟢 /login, /register → redirect logged-in users to /profile
  if (
    ["/login", "/register"].includes(req.nextUrl.pathname) &&
    session?.user
  ) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  // ✅ Allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/admin/:path*", "/login", "/register"],
};
