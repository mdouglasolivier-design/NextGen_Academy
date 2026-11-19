"use client";
import Link from "next/link";
import { useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import Field, { FormAlert } from "@/components/ui/Field";
import { ApiError, register } from "@/lib/auth/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: "", email: "", country: "Rwanda", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const next: Record<string, string> = {};
    if (!form.full_name.trim()) next.full_name = "Enter your full name. It will appear on your certificate.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
    return next;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    setLoading(true);
    try {
      await register({ ...form, email: form.email.trim(), full_name: form.full_name.trim() });
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fields).length) setErrors(err.fields);
      else setFormError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthShell title="Check your email" subtitle={`We sent a confirmation link to ${form.email}.`}>
        <FormAlert tone="success">Open the link in that email to activate your account, then log in.</FormAlert>
        <Link href="/login" className="mt-6 inline-block font-semibold text-spine-blue hover:text-blue-deep">
          Go to log in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create Account"
      subtitle="No fees. Finish a course and pass the assessment to earn a certificate."
      panelTitle="Your name on a certificate people can trust."
      image="/assets/auth/create-account.jpg"
      imageAlt="A smiling NextGen Academy student holding her notebooks"
      variant="cutout"
      compact
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-spine-blue hover:text-blue-deep">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-3 [&_input]:py-2 [&_label]:mb-1 [&_p]:mt-1" noValidate>
        {formError && <FormAlert>{formError}</FormAlert>}
        <Field
          label="Full name"
          autoComplete="name"
          value={form.full_name}
          onChange={set("full_name")}
          error={errors.full_name}
          required
        />
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          required
        />
        <Field
          label="Country"
          autoComplete="country-name"
          value={form.country}
          onChange={set("country")}
          error={errors.country}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters."
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          required
        />
        <Button type="submit" loading={loading} className="w-full">
          Create Account
        </Button>
      </form>
    </AuthShell>
  );
}