"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { clearToken, getToken, staffApi } from "@/lib/staff/api";
import type { StaffDashboard } from "@/types/staff";

const StaffContext = createContext<StaffDashboard | null>(null);
export const useStaff = () => {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error("useStaff must be used inside StaffShell");
  return ctx;
};

export default function StaffShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<StaffDashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) return router.replace("/staff-login");
    staffApi<StaffDashboard>("/staff/dashboard/")
      .then(setData)
      .catch((e) => {
        if (e.message === "unauthorized") {
          clearToken();
          router.replace("/staff-login");
        } else setError(e.message);
      });
  }, [router]);

  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!data) return <p className="p-8 text-gray-500">Loading dashboard…</p>;

  const logout = () => {
    clearToken();
    router.replace("/staff-login");
  };
  const href = (key: string) => (key === "overview" ? "/staff" : `/staff/${key}`);
  const active = (key: string) => pathname === href(key);

  return (
    <StaffContext.Provider value={data}>
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b bg-white px-4 py-3">
          <Link href="/staff" className="text-lg font-bold">University Staff</Link>
          <input
            placeholder="Search…"
            className="ml-4 hidden w-full max-w-md rounded border px-3 py-1.5 text-sm md:block"
          />
          <div className="ml-auto flex items-center gap-4">
            <button title="Notifications" aria-label="Notifications">🔔</button>
            <button title="Messages" aria-label="Messages">✉️</button>
            <details className="relative">
              <summary className="cursor-pointer list-none rounded border px-3 py-1.5 text-sm">
                {data.user.name || data.user.email} ▾
              </summary>
              <div className="absolute right-0 z-10 mt-2 w-72 rounded border bg-white p-4 text-sm shadow">
                <p className="font-semibold">{data.user.name}</p>
                <p className="text-gray-500">{data.role_title}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Last login: {data.session.last_login ? new Date(data.session.last_login).toLocaleString() : "—"}
                </p>
                <ul className="mt-3 space-y-1 text-gray-400">
                  <li>Account · Password · 2FA (soon)</li>
                  <li>Language · Theme (soon)</li>
                </ul>
                <button onClick={logout} className="mt-3 w-full rounded bg-black px-3 py-1.5 text-white">
                  Log out
                </button>
              </div>
            </details>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Left navigation: only this role's sections */}
          <nav className="w-60 shrink-0 border-r bg-slate-900 p-3 text-sm text-slate-200">
            <p className="mb-3 px-2 text-xs uppercase tracking-wide text-slate-400">{data.role_title}</p>
            <ul className="space-y-1">
              {data.sections.map((s) => (
                <li key={s.key}>
                  <Link
                    href={href(s.key)}
                    className={`block rounded px-2 py-1.5 ${active(s.key) ? "bg-slate-700 text-white" : "hover:bg-slate-800"}`}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-slate-700 pt-3">
              <Link href="/staff/activity" className="block rounded px-2 py-1.5 hover:bg-slate-800">My activity log</Link>
              <a href="/help" className="block rounded px-2 py-1.5 hover:bg-slate-800">Help center</a>
            </div>
          </nav>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </StaffContext.Provider>
  );
}
