import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-sm text-[15px] text-white/65">
            Free courses and certificates that employers and universities can check in seconds.
          </p>
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-white">Learn</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li><Link className="hover:text-white" href="/courses">Browse courses</Link></li>
            <li><Link className="hover:text-white" href="/register">Create a free account</Link></li>
            <li><Link className="hover:text-white" href="/login">Log in</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-white">Trust</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li><Link className="hover:text-white" href="/verify">Verify a certificate</Link></li>
            <li><Link className="hover:text-white" href="/about">About NextGen Academy</Link></li>
            <li><Link className="hover:text-white" href="/staff-login">Staff sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/50">
        &copy; {new Date().getFullYear()} NextGen Academy. Kigali, Rwanda.
      </div>
    </footer>
  );
}