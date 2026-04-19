const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const API_BASE = USE_MOCK
  ? ""
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

let getAuthToken: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  getAuthToken = getter;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers as Record<string, string>),
  };

  // Track whether we actually sent a real token. Only if a token was sent and
  // the server still returns 401 do we know the session is truly invalid.
  let tokenSent = false;
  if (!USE_MOCK && getAuthToken) {
    const token = await getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      tokenSent = true;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!USE_MOCK && res.status === 401) {
    // Only logout when a real token was sent and rejected. If no token was
    // available yet (Privy still initializing) just throw — don't sign the user out.
    if (tokenSent) {
      document.cookie = "oria_onboarded=; path=/; max-age=0";
      window.dispatchEvent(new CustomEvent("oria:unauthorized"));
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `API error: ${res.status}`);
  }

  return res.json();
}
