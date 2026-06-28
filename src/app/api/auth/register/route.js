import { NextResponse } from "next/server";
import { djangoFetch } from "../../../../../lib/django";

export async function POST(req) {
  try {
    const body = await req.json();
    const data = await djangoFetch("/api/v1/auth/register/", {
      method: "POST",
      body,
    });

    return NextResponse.json(
      { success: true, user: data || null },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        errors: err.data || { error: "Registration failed" },
      },
      { status: err.status || 400 }
    );
  }
}