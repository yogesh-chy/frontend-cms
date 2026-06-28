import { NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/token";
import { djangoFetch } from "@/lib/django";

export async function GET() {
  try {
    const token = await getValidAccessToken();
    const data = await djangoFetch("/api/v1/auth/users/", { token });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch users" },
      { status: err.status || 500 }
    );
  }
}
