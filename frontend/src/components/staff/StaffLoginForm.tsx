"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Field, { FormAlert } from "@/components/ui/Field";
import { staffLogin } from "@/lib/staff/api";
import type { StaffRoleInfo } from "@/lib/staff/roles";

export default function StaffLoginForm({ role }: { role: StaffRoleInfo }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your work email and password.");
      return;
    }
    setLoading(true);
    try {
      await staffLogin(email.trim(), password, role.role);
      router.push("/staff");
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {error && <FormAlert>{error}</FormAlert>}
      <Field
        label="Work email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Field
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" loading={loading} className="w-full">
        Sign in
      </Button>
      {process.env.NODE_ENV === "development" && (
        <p className="text-sm text-muted">
          Local demo account: {role.slug}@nextgen.test. The password is in the README.
        </p>
      )}
    </form>
  );
}
