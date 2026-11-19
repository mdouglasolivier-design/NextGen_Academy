import type { StaffDashboard } from "@/types/staff";
import { roleByKey } from "./roles";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const ACCESS = "staff_access";
const REFRESH = "staff_refresh";

// Phase 1 simplicity: tokens in localStorage. Move to httpOnly cookies before going public.
const browser = () => typeof window !== "undefined";
export const getToken = () => (browser() ? localStorage.getItem(ACCESS) : null);
const getRefresh = () => (browser() ? localStorage.getItem(REFRESH) : null);

export function clearToken() {
  if (!browser()) return;
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
}

const NETWORK = "We can't reach the server. Check your connection and try again.";

async function post(path: string, body: unknown): Promise<Response> {
  try {
    return await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(NETWORK);
  }
}

async function refreshAccess(): Promise<boolean> {
  const refresh = getRefresh();
  if (!refresh) return false;
  try {
    const res = await post("/auth/refresh/", { refresh });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem(ACCESS, data.access);
    if (data.refresh) localStorage.setItem(REFRESH, data.refresh);
    return true;
  } catch {
    return false;
  }
}

/** GET with the staff token. Refreshes it once when it has expired. Throws Error("unauthorized") if the session is over. */
export async function staffApi<T>(path: string): Promise<T> {
  const run = () =>
    fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${getToken()}` }, cache: "no-store" });

  let res: Response;
  try {
    res = await run();
    if (res.status === 401 && (await refreshAccess())) res = await run();
  } catch {
    throw new Error(NETWORK);
  }
  if (res.status === 401 || res.status === 403) throw new Error("unauthorized");
  if (!res.ok) throw new Error(`Something went wrong (error ${res.status}). Try again.`);
  return res.json() as Promise<T>;
}

/**
 * Signs in, then checks the account really is staff. When `expectedRole` is given (a role-specific sign-in page),
 * an account with a different role is turned away with a message that says which page to use.
 */
export async function staffLogin(email: string, password: string, expectedRole?: string): Promise<StaffDashboard> {
  const res = await post("/auth/login/", { email, password });
  if (res.status === 400 || res.status === 401) {
    throw new Error("That email and password don't match. Check them and try again.");
  }
  if (!res.ok) throw new Error("Sign-in failed. Try again in a moment.");
  const tokens = await res.json();
  localStorage.setItem(ACCESS, tokens.access);
  if (tokens.refresh) localStorage.setItem(REFRESH, tokens.refresh);

  let dash: StaffDashboard;
  try {
    dash = await staffApi<StaffDashboard>("/staff/dashboard/");
  } catch (err) {
    clearToken();
    if ((err as Error).message === "unauthorized") {
      throw new Error("This account doesn't have staff access. If you're a learner, use the learner log in instead.");
    }
    throw err;
  }

  if (expectedRole && dash.role !== expectedRole) {
    clearToken();
    const actual = roleByKey(dash.role);
    throw new Error(
      `This is ${/^[aeiou]/i.test(actual?.title ?? dash.role_title) ? "an" : "a"} ${(actual?.title ?? dash.role_title).toLowerCase()} account. Use the ${(actual?.title ?? "right").toLowerCase()} sign-in instead.`,
    );
  }
  return dash;
}
