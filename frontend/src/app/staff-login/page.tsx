import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { STAFF_ROLES } from "@/lib/staff/roles";

export const metadata: Metadata = { title: "Staff sign in" };

export default function StaffLoginHub() {
  return (
    <AuthShell
      title="Staff sign in"
      subtitle="Choose your role to continue."
      panelTitle="Run the academy."
      panelText="Each role sees only the tools it needs."
      footer={
        <>
          Are you a learner?{" "}
          <Link href="/login" className="font-semibold text-spine-blue hover:text-blue-deep">
            Log in here
          </Link>
        </>
      }
    >
      <ul className="space-y-3">
        {STAFF_ROLES.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/staff-login/${r.slug}`}
              className="block rounded-[14px] border border-rule bg-surface px-5 py-4 transition-colors hover:border-ink"
            >
              <span className="font-display text-lg font-semibold">{r.title}</span>
              <span className="mt-0.5 block text-[15px] text-ink-soft">{r.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </AuthShell>
  );
}
