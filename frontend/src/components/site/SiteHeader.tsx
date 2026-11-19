"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/verify", label: "Verify Certificate" },
  { href: "/about", label: "About" },
];

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function SearchBox({ className = "", onDone }: { className?: string; onDone?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/courses?q=${encodeURIComponent(term)}` : "/courses");
    onDone?.();
  }

  return (
    <form role="search" onSubmit={submit} className={className}>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search courses"
          aria-label="Search courses"
          className="w-full rounded-full border border-rule bg-surface py-2 pl-10 pr-4 text-[15px] text-ink placeholder:text-muted/70 hover:border-muted"
        />
      </div>
    </form>
  );
}

function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const name = user?.full_name?.trim() || user?.email || "Account";
  const initials =
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") || "U";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-spine-blue text-sm font-semibold text-white hover:bg-blue-deep"
      >
        {initials}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-60 rounded-xl border border-rule bg-surface p-1.5 shadow-lg">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            {user?.email && <p className="truncate text-sm text-muted">{user.email}</p>}
          </div>
          <div className="my-1 h-px bg-rule" />
          <Link
            role="menuitem"
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-[15px] text-ink hover:bg-ink/5"
          >
            Dashboard
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              signOut();
              setOpen(false);
              router.push("/");
            }}
            className="block w-full rounded-lg px-3 py-2 text-left text-[15px] text-ink hover:bg-ink/5"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { status, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          const main = document.querySelector("main");
          main?.setAttribute("tabindex", "-1");
          main?.focus();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
        <Logo />

        <nav aria-label="Main" className="ml-2 hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 text-[15px] font-medium ${
                  active ? "bg-ink/[0.06] text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <SearchBox className="mx-2 hidden max-w-md flex-1 lg:block" />

        <div className="ml-auto flex items-center gap-2">
          {status === "authed" ? (
            <UserMenu />
          ) : status === "anon" ? (
            <span className="hidden items-center gap-2 sm:inline-flex">
              <ButtonLink href="/login" variant="ghost">
                Log in
              </ButtonLink>
              <ButtonLink href="/register">Create Account</ButtonLink>
            </span>
          ) : (
            <span className="h-9 w-24" aria-hidden="true" />
          )}

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-ink/5 lg:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-rule bg-paper lg:hidden">
          <div className="mx-auto max-w-6xl space-y-4 px-5 py-4">
            <SearchBox onDone={() => setOpen(false)} />
            <nav aria-label="Main mobile" className="flex flex-col">
              {links.map((l) => {
                const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-lg px-3 py-2.5 text-base font-medium ${active ? "bg-ink/[0.06] text-ink" : "text-ink-soft"}`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
            {status === "authed" ? (
              <div className="flex gap-2">
                <ButtonLink href="/dashboard" className="flex-1">
                  Dashboard
                </ButtonLink>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                    router.push("/");
                  }}
                  className="flex-1 rounded-lg border border-rule bg-surface px-5 py-2.5 text-[15px] font-semibold text-ink hover:border-ink"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <ButtonLink href="/login" variant="secondary" className="flex-1">
                  Log in
                </ButtonLink>
                <ButtonLink href="/register" className="flex-1">
                  Create Account
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}