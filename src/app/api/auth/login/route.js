import { NextResponse } from "next/server";
import { djangoFetch } from "../../../../lib/django";
import { saveAuthCookies } from "../../../../lib/token";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const data = await djangoFetch("/api/v1/auth/login/", {
      method: "POST",
      body: { email, password },
    });

    await saveAuthCookies(data);
    return NextResponse.json(
      { success: true, role: data.role, user: data },
      { status: 200 }
    );
  } catch (err) {
    const errorMessage =
      err?.data?.detail ||
      err?.data?.non_field_errors?.[0] ||
      err?.data?.email?.[0] ||
      err?.data?.password?.[0] ||
      (typeof err?.data === "string" ? err.data : null) ||
      (err?.status === 401 || err?.status === 400 ? "Wrong email or password" : "Login failed");

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: err?.status || 500 }
    );
  }
}