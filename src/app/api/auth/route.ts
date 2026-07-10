import { NextRequest, NextResponse } from "next/server";
import { djangoProxy } from "@/lib/proxy";
import { saveAuthCookies, clearAuthCookies } from "@/lib/token";

export async function POST(req: NextRequest) {
  const action = req.nextUrl.searchParams.get("action");

  if (action === "logout") {
    await clearAuthCookies();
    return NextResponse.json({ success: true });
  }

  if (action === "register") {
    try {
      const body = await req.json();
      const data = await djangoProxy("/api/v1/auth/register/", {
        method: "POST",
        body,
      });
      return NextResponse.json({ success: true, user: data || null }, { status: 201 });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, errors: err.data || { error: "Registration failed" } },
        { status: err.status || 400 }
      );
    }
  }

  // Default POST: Login
  try {
    const { email, password } = await req.json();
    const data = await djangoProxy("/api/v1/auth/login/", {
      method: "POST",
      body: { email, password },
    });

    await saveAuthCookies({
      access: data.access,
      refresh: data.refresh,
      role: data.user?.role || "",
      email: data.user?.email || "",
    });
    return NextResponse.json({ success: true, role: data.user?.role, user: data.user }, { status: 200 });
  } catch (err: any) {
    const errorMessage =
      err?.data?.detail ||
      err?.data?.non_field_errors?.[0] ||
      err?.data?.email?.[0] ||
      err?.data?.password?.[0] ||
      (typeof err?.data === "string" ? err.data : null) ||
      (err?.status === 401 || err?.status === 400 ? "Wrong email or password" : "Login failed");

    return NextResponse.json({ success: false, error: errorMessage }, { status: err?.status || 500 });
  }
}

export async function GET() {
  try {
    const data = await djangoProxy("/api/v1/auth/me/", { requireAuth: true });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function DELETE() {
  await clearAuthCookies();
  return NextResponse.json({ success: true });
}
