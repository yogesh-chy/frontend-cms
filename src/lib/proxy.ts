import { getValidAccessToken } from "./token";

export interface ProxyOptions {
  method?: string;
  body?: any;
  requireAuth?: boolean;
}

export async function djangoProxy(path: string, options: ProxyOptions = {}) {
  const { method = "GET", body, requireAuth = false } = options;
  const DJANGO = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requireAuth) {
    const token = await getValidAccessToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = path.startsWith("/") ? `${DJANGO}${path}` : `${DJANGO}/${path}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err: any = new Error(data?.detail || "Backend request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
