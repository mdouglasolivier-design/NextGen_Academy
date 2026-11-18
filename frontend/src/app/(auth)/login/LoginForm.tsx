"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import Field, { FormAlert } from "@/components/ui/Field";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function LoginForm({ next }: { next?: string | null }) {
  const router = useRouter();
  const { signIn, status } = useAuth();
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authed") router.replace(safeNext);
  }, [status, router, safeNext]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace(safeNext);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {error && <FormAlert>{error}</FormAlert>}
      <Field
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div>
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className="mt-2 text-right text-sm">
          <Link href="/forgot-password" className="font-medium text-spine-blue hover:text-blue-deep">
            Forgot your password?
          </Link>
        </p>
      </div>
      <Button type="submit" loading={loading} className="w-full">
        Log in
      </Button>
    </form>
  );
}