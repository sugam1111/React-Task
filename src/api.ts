const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem("auth") || "null");
  } catch {
    return null;
  }
}

export function setStoredAuth(auth: unknown) {
  localStorage.setItem("auth", JSON.stringify(auth));
}

export function clearStoredAuth() {
  localStorage.removeItem("auth");
}

export async function request<T>(path: string, options?: {
  method?: string;
  body?: unknown;
  token?: string | null;
}): Promise<T> {

  // headers which start with JSON type
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // add token header if token exists
  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  // 3) send request
  const res = await fetch(`${BASE_URL}${path}`, {
    method: options?.method ?? "GET",
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  // 4) read response JSON (or null if not JSON)
  const data = await res.json().catch(() => null);

  // 5) if error status, throw error
  if (!res.ok) {
    const msg = (data as any)?.message ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }

  // 6) if success, return data
  return data as T;
}


