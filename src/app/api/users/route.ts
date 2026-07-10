import { NextRequest, NextResponse } from "next/server";
import { djangoProxy } from "@/lib/proxy";

export async function GET() {
  try {
    const data = await djangoProxy("/api/v1/auth/users/", { requireAuth: true });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch users" },
      { status: err.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const action = req.nextUrl.searchParams.get("action");

  if (id && action === "approve") {
    try {
      const data = await djangoProxy(`/api/v1/auth/users/${id}/approve/`, {
        method: "POST",
        requireAuth: true,
      });
      return NextResponse.json({ success: true, ...data });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message || "Approval failed" },
        { status: err.status || 500 }
      );
    }
  }

  return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
  }

  try {
    const data = await djangoProxy(`/api/v1/auth/users/${id}/`, {
      method: "DELETE",
      requireAuth: true,
    });
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete user" },
      { status: err.status || 500 }
    );
  }
}
