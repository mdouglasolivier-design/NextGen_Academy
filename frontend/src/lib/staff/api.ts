const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const KEY = "staff_access";

// Phase 1 simplicity: token in localStorage. Move to httpOnly cookies before going public.
export const getToken = () => (typeof window === "undefined" ? null : localStorage.getItem(KEY));
export const clearToken = () => localStorage.removeItem(KEY);

export async function staffLogin(email: string, password: string) {
  const res = await fetch(`${API}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid email or password");
  const data = await res.json();
  localStorage.setItem(KEY, data.access);
}

export async function staffApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) throw new Error("unauthorized");
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}
