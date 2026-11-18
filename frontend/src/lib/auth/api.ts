import type { User } from "@/types";
import { clearTokens, getAccess, getRefresh, setTokens } from "./storage";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;
  constructor(message: string, status = 0, fields: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

const NETWORK_MESSAGE = "We can't reach the server. Check your connection and try again.";

/** Turns a DRF error body into one message plus per-field messages. */
async function toApiError(res: Response, fallback: string): Promise<ApiError> {
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON body */
  }
  const fields: Record<string, string> = {};
  let message = fallback;
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (typeof obj.detail === "string") message = obj.detail;
    for (const [key, val] of Object.entries(obj)) {
      if (key === "detail") continue;
      const first = Array.isArray(val) ? val[0] : val;
      if (typeof first === "string") fields[key] = first;
    }
  }
  return new ApiError(message, res.status, fields);
}

async function post(path: string, payload: unknown): Promise<Response> {
  try {
    return await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError(NETWORK_MESSAGE);
  }
}

export async function login(email: string, password: string): Promise<void> {
  const res = await post("/auth/login/", { email, password });
  if (res.status === 401 || res.status === 400) {
    throw new ApiError("That email and password don't match. Check them and try again.", res.status);
  }
  if (!res.ok) throw await toApiError(res, "Sign-in failed. Try again in a moment.");
  const data = await res.json();
  setTokens(data.access, data.refresh);
}

export interface RegisterInput {
  full_name: string;
  email: string;
  country: string;
  password: string;
}

export async function register(input: RegisterInput): Promise<void> {
  const res = await post("/auth/register/", input);
  if (res.status === 404 || res.status === 405) {
    throw new ApiError("Sign-up isn't open yet. Please check back soon.", res.status);
  }
  if (!res.ok) throw await toApiError(res, "We couldn't create your account. Try again in a moment.");
}

export async function requestPasswordReset(email: string): Promise<void> {
  const res = await post("/auth/password-reset/", { email });
  if (res.status === 404 || res.status === 405) {
    throw new ApiError("Password reset isn't available yet. Please contact support.", res.status);
  }
  if (!res.ok) throw await toApiError(res, "We couldn't send the reset link. Try again in a moment.");
}

async function refreshAccess(): Promise<boolean> {
  const refresh = getRefresh();
  if (!refresh) return false;
  try {
    const res = await post("/auth/refresh/", { refresh });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data.access, data.refresh);
    return true;
  } catch {
    return false;
  }
}

/** Authenticated request that refreshes the access token once on a 401. */
export async function authedApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const run = () =>
    fetch(`${API}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
        Authorization: `Bearer ${getAccess()}`,
      },
      cache: "no-store",
    });

  let res: Response;
  try {
    res = await run();
    if (res.status === 401 && (await refreshAccess())) res = await run();
  } catch {
    throw new ApiError(NETWORK_MESSAGE);
  }
  if (res.status === 401) {
    clearTokens();
    throw new ApiError("Your session has ended. Sign in again.", 401);
  }
  if (!res.ok) throw await toApiError(res, "Something went wrong. Try again.");
  return res.json() as Promise<T>;
}

export const fetchMe = () => authedApi<User>("/me/");