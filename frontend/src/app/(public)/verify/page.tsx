import type { Metadata } from "next";
import VerifyForm from "@/components/site/VerifyForm";

export const metadata: Metadata = { title: "Verify a certificate" };

export default function VerifyIndexPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="text-4xl font-bold sm:text-5xl">Verify a certificate</h1>
      <p className="mt-4 text-lg text-ink-soft">
        Enter the code printed on the certificate. We&rsquo;ll show who earned it, for which course, and whether it&rsquo;s still valid.
      </p>
      <div className="mt-8">
        <VerifyForm />
      </div>
    </main>
  );
}