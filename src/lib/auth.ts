import { cookies } from "next/headers";
import { AUTH_KEYS } from "./constants";

export async function setAuthSession({ access, refresh, role, email }: { access: string; refresh: string; role: string; email: string }) {
  const jar = await cookies();
  jar.set(AUTH_KEYS.ACCESS_TOKEN, access, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 1800, path: "/" });
  jar.set(AUTH_KEYS.REFRESH_TOKEN, refresh, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 604800, path: "/" });
  jar.set(AUTH_KEYS.USER_ROLE, role, { sameSite: "lax", maxAge: 604800, path: "/" });
  jar.set(AUTH_KEYS.USER_EMAIL, email, { sameSite: "lax", maxAge: 604800, path: "/" });
}

export async function destroyAuthSession() {
  const jar = await cookies();
  Object.values(AUTH_KEYS).forEach((k) => jar.delete(k));
}
