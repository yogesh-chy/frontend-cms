import { cookies } from "next/headers";

export interface AuthCookieParams {
  access: string;
  refresh: string;
  role: string;
  email: string;
}

export async function saveAuthCookies({ access, refresh, role, email }: AuthCookieParams): Promise<void> {
  const jar = await cookies();

  jar.set("access_token", access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 30, // 30 mins
    path: "/",
  });

  jar.set("refresh_token", refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  jar.set("user_role", role, { sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
  jar.set("user_email", email, { sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
}

export async function clearAuthCookies(): Promise<void> {
  const jar = await cookies();
  ["access_token", "refresh_token", "user_role", "user_email"].forEach((c) => jar.delete(c));
}

export async function getAuthCookies(): Promise<{ access: string | null; refresh: string | null; role: string | null; email: string | null }> {
  const jar = await cookies();
  return {
    access: jar.get("access_token")?.value || null,
    refresh: jar.get("refresh_token")?.value || null,
    role: jar.get("user_role")?.value || null,
    email: jar.get("user_email")?.value || null,
  };
}

export async function getValidAccessToken(): Promise<string> {
  const { access, refresh } = await getAuthCookies();

  if (access) return access;

  if (refresh) {
    try {
      const DJANGO = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${DJANGO}/api/v1/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
        cache: "no-store",
      });

      if (!res.ok) throw new Error("REFRESH_FAILED");
      const data = await res.json();

      const jar = await cookies();
      jar.set("access_token", data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 30,
        path: "/",
      });
      return data.access;
    } catch {
      await clearAuthCookies();
      throw new Error("SESSION_EXPIRED");
    }
  }

  throw new Error("NOT_LOGGED_IN");
}
