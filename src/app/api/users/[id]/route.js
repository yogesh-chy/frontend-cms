import { NextResponse } from "next/server";
import { getValidAccessToken } from "../../../../lib/token";
import { djangoFetch } from "../../../../lib/django";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const token = await getValidAccessToken();
    const data = await djangoFetch(`/api/v1/auth/users/${id}/`, {
      method: "DELETE",
      token,
    });
    return NextResponse.json({ success: true, ...data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete user" },
      { status: err.status || 500 }
    );
  }
}
