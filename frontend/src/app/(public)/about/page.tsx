import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-4xl font-bold sm:text-5xl">Learning that opens doors</h1>
      <div className="mt-8 space-y-5 text-lg text-ink-soft">
        <p>
          NextGen Academy is a free online learning platform built in Kigali. You study at your own pace, take an
          assessment, and if you pass, you receive a certificate.
        </p>
        <p>
          A certificate is only useful if people believe it. Every one we issue has a unique code. Anyone, including an
          employer or a university admissions team, can enter that code on our Verify page and see the holder, the
          course and whether it’s still valid.
        </p>
        <p>
          We’re starting with free certificates, and we’re building the platform in the open: courses, assessments and
          verification first, then more from there.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/register">Create account</ButtonLink>
        <ButtonLink href="/verify" variant="secondary">
          Verify a certificate
        </ButtonLink>
      </div>
    </main>
  );
}
