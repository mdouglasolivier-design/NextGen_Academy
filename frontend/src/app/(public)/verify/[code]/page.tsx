import type { Metadata } from "next";
import Link from "next/link";
import VerifyForm from "@/components/site/VerifyForm";
import type { CertificateVerification } from "@/types";

export const metadata: Metadata = { title: "Certificate verification" };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

type Result =
  | { kind: "found"; data: CertificateVerification }
  | { kind: "missing" }
  | { kind: "unavailable" };

async function lookup(code: string): Promise<Result> {
  try {
    const res = await fetch(`${API_URL}/verify/${encodeURIComponent(code)}/`, { cache: "no-store" });
    if (res.status === 404) return { kind: "missing" };
    if (!res.ok) return { kind: "unavailable" };
    return { kind: "found", data: (await res.json()) as CertificateVerification };
  } catch {
    return { kind: "unavailable" };
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params;
  const code = decodeURIComponent(raw);
  const result = await lookup(code);

  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="text-4xl font-bold sm:text-5xl">Certificate verification</h1>

      {result.kind === "found" && (
        <div
          className={`mt-8 overflow-hidden rounded-[14px] border bg-surface ${
            result.data.valid ? "border-spine-green" : "border-spine-red"
          }`}
        >
          <div className={`px-6 py-3 font-semibold text-white ${result.data.valid ? "bg-spine-green" : "bg-spine-red"}`}>
            {result.data.valid ? "Valid certificate" : "This certificate has been revoked"}
          </div>
          <div className="space-y-1 px-6 py-6">
            <p className="font-display text-3xl font-bold">{result.data.holder_name}</p>
            <p className="text-lg text-ink-soft">completed {result.data.course}</p>
            <p className="pt-3 text-sm text-muted">
              Issued {formatDate(result.data.issued_at)}. Code {result.data.certificate_code}.
            </p>
          </div>
        </div>
      )}

      {result.kind === "missing" && (
        <div role="alert" className="mt-8 rounded-[14px] border border-spine-red/40 bg-spine-red/5 p-6">
          <p className="font-display text-xl font-semibold text-red-deep">No certificate matches &ldquo;{code}&rdquo;.</p>
          <p className="mt-1 text-ink-soft">Check the code for typos, then try again.</p>
        </div>
      )}

      {result.kind === "unavailable" && (
        <div role="alert" className="mt-8 rounded-[14px] border border-rule bg-surface p-6">
          <p className="font-display text-xl font-semibold">We couldn&rsquo;t check this code right now.</p>
          <p className="mt-1 text-ink-soft">That doesn&rsquo;t mean the certificate is invalid. Try again in a moment.</p>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-xl font-semibold">Check another certificate</h2>
        <div className="mt-4">
          <VerifyForm />
        </div>
        <Link href="/courses" className="mt-8 inline-block text-[15px] font-medium text-spine-blue hover:text-blue-deep">
          Browse courses
        </Link>
      </div>
    </main>
  );
}