import { NextResponse } from "next/server";
import { getValidAccessToken } from "../../../../lib/token";
import { djangoFetch } from "../../../../lib/django";

export async function GET() {
  try {
    const token = await getValidAccessToken();
    const data = await djangoFetch("/api/v1/auth/profile/", { token });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}