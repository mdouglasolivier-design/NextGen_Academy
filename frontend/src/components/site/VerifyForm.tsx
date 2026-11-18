"use client";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";

export default function VerifyForm({ onDark = false }: { onDark?: boolean }) {
  const router = useRouter();
  const id = useId();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = code.trim();
    if (!clean) {
      setError("Enter the code printed on the certificate.");
      return;
    }
    router.push(`/verify/${encodeURIComponent(clean)}`);
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor={id} className={`mb-1.5 block text-sm font-medium ${onDark ? "text-white" : "text-ink"}`}>
        Certificate code
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={id}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          aria-invalid={error ? true : undefined}
          placeholder="Paste the code from the certificate"
          className="min-w-0 flex-1 rounded-lg border border-rule bg-surface px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted/70"
        />
        <Button type="submit" variant={onDark ? "onDark" : "primary"}>
          Verify certificate
        </Button>
      </div>
      {error && (
        <p role="alert" className={`mt-1.5 text-sm ${onDark ? "text-white" : "text-red-deep"}`}>
          {error}
        </p>
      )}
    </form>
  );
}