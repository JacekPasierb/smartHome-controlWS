import {authStorage} from "../features/auth/storage/authStorage";

export async function http<T>(url: string, init: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
      ...(init.headers || {}),
    },
  });

  if (res.status === 401) {
    authStorage.clear();
    window.location.reload();
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || `HTTP ${res.status}`);
  }

  return res.json();
}
