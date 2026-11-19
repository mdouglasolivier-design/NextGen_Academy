import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

/**
 * Form on the left, a photo panel on the right.
 * variant "photo"  = full-bleed photo with a dark fade behind the text.
 * variant "cutout" = person on a white background, blended onto a blue panel.
 * compact          = tighter spacing so longer forms fit without scrolling.
 */
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
  panelTitle = "Learn free. Prove it.",
  panelText = "Every certificate carries a code that anyone can check on our Verify page.",
  image = "/assets/auth/login.jpg",
  imageAlt = "A learner studying a NextGen Academy course on a laptop",
  variant = "photo",
  compact = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  panelTitle?: string;
  panelText?: string;
  image?: string;
  imageAlt?: string;
  variant?: "photo" | "cutout";
  compact?: boolean;
}) {
  const cutout = variant === "cutout";
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <main className="flex min-h-screen flex-col">
        {/* Logo sits in the very top-left corner */}
        <div className="px-4 pt-3 sm:px-5">
          <Logo />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-4 sm:px-0">
          <h1 className={compact ? "text-2xl font-bold sm:text-3xl" : "text-3xl font-bold sm:text-4xl"}>{title}</h1>
          {subtitle && <p className={`${compact ? "mt-2 text-[15px]" : "mt-3"} text-ink-soft`}>{subtitle}</p>}
          <div className={compact ? "mt-5" : "mt-8"}>{children}</div>
          {footer && <div className={`${compact ? "mt-4" : "mt-6"} text-[15px] text-ink-soft`}>{footer}</div>}
        </div>
        <p className="px-4 pb-3 text-sm text-muted sm:px-5">
          <Link href="/" className="hover:text-ink">Back to home</Link>
        </p>
      </main>

      {cutout ? (
        <aside
          className="relative isolate hidden overflow-hidden text-ink lg:flex lg:flex-col"
          style={{ background: "linear-gradient(160deg, #dce8ff 0%, #c3d8ff 55%, #a9c8ff 100%)" }}
        >
          {/* soft light behind the person */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[14%] aspect-square h-[72%] -translate-x-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 68%)" }}
          />
          <div className="relative min-h-0 flex-1">
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 0px"
              className="object-contain object-bottom mix-blend-multiply"
            />
          </div>
          <div className="relative max-w-sm px-12 pb-10 pt-5">
            <h2 className="text-3xl font-bold">{panelTitle}</h2>
            <p className="mt-3 text-ink/70">{panelText}</p>
          </div>
        </aside>
      ) : (
        <aside className="relative hidden overflow-hidden bg-ink text-white lg:flex lg:flex-col lg:justify-end lg:p-14">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 0px"
            className="object-cover object-top"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(18,21,28,0.92) 0%, rgba(18,21,28,0.55) 40%, rgba(18,21,28,0) 70%)" }}
          />
          <div className="relative max-w-sm">
            <h2 className="text-3xl font-bold">{panelTitle}</h2>
            <p className="mt-3 text-white/80">{panelText}</p>
          </div>
        </aside>
      )}
    </div>
  );
}