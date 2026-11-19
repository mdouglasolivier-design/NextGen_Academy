"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
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
    if (!getToken()) {
      router.replace("/staff-login");
      return;
    }
    staffApi<StaffDashboard>("/staff/dashboard/")
      .then(setData)
      .catch((e: Error) => {
        if (e.message === "unauthorized") {
          clearToken();
          router.replace("/staff-login");
        } else setError(e.message);
      });
  }, [router]);

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <div role="alert" className="max-w-md rounded-[14px] border border-rule bg-surface p-6">
          <p className="font-display text-xl font-semibold">The dashboard isn&rsquo;t loading.</p>
          <p className="mt-1 text-ink-soft">{error}</p>
          <button onClick={() => location.reload()} className="mt-4 font-semibold text-spine-blue hover:text-blue-deep">
            Try again
          </button>
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center text-muted" role="status">
        Loading your dashboard&hellip;
      </div>
    );
  }

  const logout = () => {
    clearToken();
    router.replace("/staff-login");
  };
  const href = (key: string) => (key === "overview" ? "/staff" : `/staff/${key}`);
  const links = [
    ...data.sections.map((s) => ({ href: href(s.key), label: s.label })),
    { href: "/staff/activity", label: "My activity log" },
  ];
  const isActive = (h: string) => pathname === h;

  return (
    <StaffContext.Provider value={data}>
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center gap-4 border-b border-rule bg-surface px-5 py-3">
          <Logo href="/staff" />
          <span className="hidden rounded-md bg-ink/[0.06] px-2 py-0.5 text-sm font-medium text-ink-soft sm:inline">
            Staff
          </span>
          <details className="relative ml-auto">
            <summary className="cursor-pointer list-none rounded-lg border border-rule px-3.5 py-2 text-[15px] font-medium hover:border-ink">
              {data.user.name || data.user.email}
            </summary>
            <div className="absolute right-0 z-10 mt-2 w-72 rounded-[14px] border border-rule bg-surface p-4 text-[15px] shadow-[0_8px_24px_rgba(18,21,28,0.12)]">
              <p className="font-display text-lg font-semibold">{data.user.name}</p>
              <p className="text-ink-soft">{data.role_title}</p>
              <p className="mt-1 break-all text-sm text-muted">{data.user.email}</p>
              <p className="mt-3 text-sm text-muted">
                Last login:{" "}
                {data.session.last_login ? new Date(data.session.last_login).toLocaleString() : "not recorded"}
              </p>
              <button
                onClick={logout}
                className="mt-4 w-full rounded-lg bg-ink px-3 py-2 font-semibold text-white hover:bg-ink-soft"
              >
                Log out
              </button>
            </div>
          </details>
        </header>

        {/* Small screens: a scrollable row instead of the sidebar */}
        <nav aria-label="Staff mobile" className="flex gap-1 overflow-x-auto border-b border-rule bg-surface px-3 py-2 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ${
                isActive(l.href) ? "bg-ink text-white" : "text-ink-soft"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1">
          <nav aria-label="Staff" className="hidden w-64 shrink-0 bg-ink px-3 py-6 text-[15px] text-white/75 lg:block">
            <p className="mb-3 px-3 font-display text-base font-semibold text-white">{data.role_title}</p>
            <ul className="space-y-0.5">
              {links.map((l, i) => (
                <li key={l.href} className={i === links.length - 1 ? "mt-4 border-t border-white/10 pt-4" : ""}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`block rounded-md border-l-[3px] px-3 py-2 ${
                      isActive(l.href)
                        ? "border-spine-green bg-white/10 font-medium text-white"
                        : "border-transparent hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </StaffContext.Provider>
  );
}
