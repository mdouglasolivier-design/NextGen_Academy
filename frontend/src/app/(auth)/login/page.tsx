import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your courses and download your certificates."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-semibold text-spine-blue hover:text-blue-deep">
            Create Account
          </Link>
        </>
      }
    >
      <LoginForm next={Array.isArray(next) ? next[0] : next} />
    </AuthShell>
  );
}