// Phase 1: tokens live in localStorage. Move to httpOnly cookies before going public.
const ACCESS = "ngx_access";
const REFRESH = "ngx_refresh";

const isBrowser = () => typeof window !== "undefined";

export const getAccess = () => (isBrowser() ? localStorage.getItem(ACCESS) : null);
export const getRefresh = () => (isBrowser() ? localStorage.getItem(REFRESH) : null);

export function setTokens(access: string, refresh?: string) {
  localStorage.setItem(ACCESS, access);
  if (refresh) localStorage.setItem(REFRESH, refresh);
}

export function clearTokens() {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
}