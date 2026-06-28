import { NextResponse } from "next/server";
import { getValidAccessToken } from "../../../../../lib/token";
import { djangoFetch } from "../../../../../lib/django";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const token = await getValidAccessToken();
    const data = await djangoFetch(`/api/v1/auth/users/${id}/approve/`, {
      method: "POST",
      token,
    });
    return NextResponse.json({ success: true, ...data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Approval failed" },
      { status: err.status || 500 }
    );
  }
}
