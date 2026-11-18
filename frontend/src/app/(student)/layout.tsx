"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useRequireAuth } from "@/lib/auth/AuthProvider";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses", label: "Browse courses" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, status, signOut } = useRequireAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (status !== "authed" || !user) {
    return (
      <div className="grid min-h-screen place-items-center text-muted" role="status">
        Loading your account&hellip;
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-rule bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3">
          <Logo href="/dashboard" />
          <nav aria-label="Student" className="flex gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={pathname === n.href ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 text-[15px] font-medium ${
                  pathname === n.href ? "bg-ink/[0.06] text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">{user.email}</span>
            <Button
              variant="secondary"
              onClick={() => {
                signOut();
                router.replace("/");
              }}
            >
              Log out
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-10">{children}</div>
    </div>
  );
}