import { NextResponse } from "next/server";
import { djangoFetch } from "@/lib/django";
import { saveAuthCookies } from "@/lib/token";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const data = await djangoFetch("/api/v1/auth/login/", {
      method: "POST",
      body: { email, password },
    });
    // data = { access, refresh, role, email }
    await saveAuthCookies(data);
    return NextResponse.json({ success: true, role: data.role });
  } catch (err) {
    return NextResponse.json(
      { error: err.status === 401 ? "Wrong email or password" : "Login failed" },
      { status: err.status || 500 }
    );
  }
}