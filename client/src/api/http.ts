import {authStorage} from "../auth/authStorage";

export async function http<T>(url: string, init: RequestInit = {}): Promise<T> {
  const token = authStorage.get();

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
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}
