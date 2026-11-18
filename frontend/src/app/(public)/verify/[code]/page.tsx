import { api } from "@/lib/api/client";
import type { CertificateVerification } from "@/types";

export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  let data: CertificateVerification | null = null;
  try {
    data = await api<CertificateVerification>(`/verify/${code}/`);
  } catch {
    data = null;
  }
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-bold">Certificate Verification</h1>
      {!data ? (
        <p className="mt-4 text-red-600">No certificate found for code {code}.</p>
      ) : (
        <div className="mt-4 rounded border p-4">
          <p className={data.valid ? "text-green-700" : "text-red-600"}>
            {data.valid ? "Valid certificate" : "Revoked certificate"}
          </p>
          <p className="mt-2"><b>{data.holder_name}</b> completed <b>{data.course}</b></p>
          <p className="text-sm text-gray-600">Issued {data.issued_at} · {data.certificate_code}</p>
        </div>
      )}
    </main>
  );
}
