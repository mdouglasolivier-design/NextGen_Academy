"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/verify", label: "Verify a certificate" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { status, user } = useAuth();

  return (
    <header className="border-b border-rule bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5">
        <Logo />
        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
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
        <div className="ml-auto flex items-center gap-2">
          {status === "authed" ? (
            <ButtonLink href="/dashboard">Dashboard</ButtonLink>
          ) : (
            <>
              <span className="hidden sm:inline-flex">
                <ButtonLink href="/login" variant="ghost">
                  Log in
                </ButtonLink>
              </span>
              <ButtonLink href="/register">
                <span className="sm:hidden">Sign up</span>
                <span className="hidden sm:inline">Create free account</span>
              </ButtonLink>
            </>
          )}
        </div>
      </div>
      {/* Mobile nav: simple row, no JS needed */}
      <nav aria-label="Main mobile" className="flex gap-1 overflow-x-auto border-t border-rule px-4 py-2 md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium text-ink-soft">
            {l.label}
          </Link>
        ))}
        {status !== "authed" && (
          <Link href="/login" className="ml-auto whitespace-nowrap rounded-md px-3 py-1 text-sm font-semibold text-spine-blue">
            Log in
          </Link>
        )}
      </nav>
    </header>
  );
}