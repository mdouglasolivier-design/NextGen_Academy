"use client";
import Link from "next/link";
import { useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import Field, { FormAlert } from "@/components/ui/Field";
import { requestPasswordReset } from "@/lib/auth/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email you signed up with and we'll send you a link to choose a new password."
      footer={
        <Link href="/login" className="font-semibold text-spine-blue hover:text-blue-deep">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <FormAlert tone="success">
          If an account exists for {email}, a reset link is on its way. It can take a few minutes to arrive.
        </FormAlert>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          {error && <FormAlert>{error}</FormAlert>}
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}