import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const rawRole = request.cookies.get("user_role")?.value;
  const role = rawRole ? rawRole.toUpperCase().replace(/\s+/g, "_") : "";
  const { pathname } = request.nextUrl;

  // Redirect authenticated sessions away from login to their portals
  if (pathname === "/login") {
    if (token && role) {
      if (role === "INSTITUTE_OWNER") {
        return NextResponse.redirect(new URL("/institute-owner", request.url));
      }
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (role === "FACULTY") {
        return NextResponse.redirect(new URL("/faculty", request.url));
      }
      if (role === "ACCOUNTANT") {
        return NextResponse.redirect(new URL("/accountant", request.url));
      }
      if (role === "LIBRARIAN") {
        return NextResponse.redirect(new URL("/librarian", request.url));
      }
      if (role === "RECEPTION") {
        return NextResponse.redirect(new URL("/receptionist", request.url));
      }
      if (role === "LAB_ASSISTANT") {
        return NextResponse.redirect(new URL("/lab-assistant", request.url));
      }
      if (role === "STUDENT") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  // Protect the institute owner portal
  if (pathname.startsWith("/institute-owner")) {
    if (!token || role !== "INSTITUTE_OWNER") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect the admin portal
  if (pathname.startsWith("/admin")) {
    if (!token || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect the faculty portal
  if (pathname.startsWith("/faculty")) {
    if (!token || role !== "FACULTY") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect the accountant portal
  if (pathname.startsWith("/accountant")) {
    if (!token || role !== "ACCOUNTANT") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect the librarian portal
  if (pathname.startsWith("/librarian")) {
    if (!token || role !== "LIBRARIAN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect the receptionist portal
  if (pathname.startsWith("/receptionist")) {
    if (!token || role !== "RECEPTION") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect the lab assistant portal
  if (pathname.startsWith("/lab-assistant")) {
    if (!token || role !== "LAB_ASSISTANT") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/institute-owner/:path*",
    "/faculty/:path*",
    "/accountant/:path*",
    "/librarian/:path*",
    "/receptionist/:path*",
    "/lab-assistant/:path*",
    "/login",
  ],
};
