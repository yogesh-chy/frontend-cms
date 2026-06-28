import { cookies } from "next/headers";
import { djangoFetch } from "./django";

export async function saveAuthCookies({ access, refresh, role, email }) {
  const jar = await cookies();

  // access token — httpOnly (JS can't read it, very secure)
  jar.set("access_token", access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 30, // 30 min
    path: "/",
  });

  // refresh token — httpOnly
  jar.set("refresh_token", refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  // role + email — NOT httpOnly so your UI can read them
  jar.set("user_role", role, { sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
  jar.set("user_email", email, { sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
}

export async function clearAuthCookies() {
  const jar = await cookies();
  ["access_token", "refresh_token", "user_role", "user_email"].forEach((c) => jar.delete(c));
}

export async function getAuthCookies() {
  const jar = await cookies();
  return {
    access:  jar.get("access_token")?.value  || null,
    refresh: jar.get("refresh_token")?.value || null,
    role:    jar.get("user_role")?.value     || null,
    email:   jar.get("user_email")?.value    || null,
  };
}

// Call this before any protected Django request — auto-refreshes if expired
export async function getValidAccessToken() {
  const { access, refresh } = await getAuthCookies();

  if (access) return access; // still valid, use it

  if (refresh) {
    // access expired — silently get a new one using the refresh token
    try {
      const data = await djangoFetch("/api/v1/auth/refresh/", {
        method: "POST",
        body: { refresh },
      });
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