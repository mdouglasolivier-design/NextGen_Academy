import Link from "next/link";

/** Three stacked books, drawn as SVG so it works on light and dark backgrounds. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="6" y="26" width="30" height="9" rx="2.5" fill="#1e5bd0" />
      <rect x="4" y="16.5" width="31" height="9" rx="2.5" fill="#d3281f" />
      <rect x="7" y="7" width="28" height="9" rx="2.5" fill="#3e9a1f" />
      <rect x="9" y="9.6" width="12" height="1.6" rx="0.8" fill="#fff" opacity="0.55" />
    </svg>
  );
}

export default function Logo({ dark = false, href = "/" }: { dark?: boolean; href?: string }) {
  return (
    <Link href={href} className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap" aria-label="NextGen Academy home">
      <LogoMark />
      <span
        className={`font-display text-lg font-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}
      >
        NextGen Academy
      </span>
    </Link>
  );
}