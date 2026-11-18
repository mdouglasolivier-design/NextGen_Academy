import Link from "next/link";
import Logo, { LogoMark } from "@/components/ui/Logo";

/** Form on the left, a quiet ink panel with the spine stack on the right. */
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
  panelTitle = "Learn free. Prove it.",
  panelText = "Every certificate carries a code that anyone can check on our Verify page.",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  panelTitle?: string;
  panelText?: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-3 text-ink-soft">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-[15px] text-ink-soft">{footer}</div>}
        </div>
        <p className="text-sm text-muted">
          <Link href="/" className="hover:text-ink">Back to home</Link>
        </p>
      </main>
      <aside className="relative hidden overflow-hidden bg-ink text-white lg:flex lg:flex-col lg:justify-end lg:p-14">
        <div className="absolute inset-x-14 top-20 space-y-3" aria-hidden="true">
          <div className="spine-in h-16 w-[78%] rounded-lg bg-spine-green" style={{ animationDelay: "0.05s" }} />
          <div className="spine-in ml-[-14px] h-16 w-[86%] rounded-lg bg-spine-red" style={{ animationDelay: "0.18s" }} />
          <div className="spine-in ml-[6px] h-16 w-[74%] rounded-lg bg-spine-blue" style={{ animationDelay: "0.31s" }} />
        </div>
        <div className="relative max-w-sm">
          <LogoMark size={28} />
          <h2 className="mt-4 text-3xl font-bold">{panelTitle}</h2>
          <p className="mt-3 text-white/70">{panelText}</p>
        </div>
      </aside>
    </div>
  );
}