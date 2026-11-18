"use client";
import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  const firstName = user.full_name.trim().split(" ")[0] || "there";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold">Hello, {firstName}</h1>
        <p className="mt-2 text-ink-soft">Pick up where you left off, or start something new.</p>
      </div>

      {user.email_verified_at === null && (
        <div role="status" className="rounded-[14px] border border-spine-blue/30 bg-spine-blue/5 px-5 py-4 text-[15px]">
          <span className="font-semibold text-blue-deep">Confirm your email.</span>{" "}
          <span className="text-ink-soft">
            Check your inbox for the link we sent to {user.email}. You&rsquo;ll need it to receive certificates.
          </span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-[14px] border border-rule bg-surface p-6">
          <h2 className="text-2xl font-bold">My courses</h2>
          <div className="mt-4 flex gap-4">
            <span className="w-3 shrink-0 rounded-full bg-spine-green" aria-hidden="true" />
            <div>
              <p className="font-display text-lg font-semibold">You haven&rsquo;t enrolled in a course yet.</p>
              <p className="mt-1 text-ink-soft">Courses you start will show up here with your progress.</p>
              <ButtonLink href="/courses" className="mt-4">
                Browse courses
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="rounded-[14px] border border-rule bg-surface p-6">
          <h2 className="text-2xl font-bold">Certificates</h2>
          <div className="mt-4 flex gap-4">
            <span className="w-3 shrink-0 rounded-full bg-spine-red" aria-hidden="true" />
            <p className="text-ink-soft">
              Pass a course assessment and your certificate will appear here, ready to share.
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-[14px] border border-rule bg-surface p-6">
        <h2 className="text-2xl font-bold">Your details</h2>
        <dl className="mt-4 grid gap-4 text-[15px] sm:grid-cols-3">
          <div>
            <dt className="text-muted">Name on certificates</dt>
            <dd className="mt-0.5 font-medium">{user.full_name || "Not set"}</dd>
          </div>
          <div>
            <dt className="text-muted">Email</dt>
            <dd className="mt-0.5 font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-muted">Country</dt>
            <dd className="mt-0.5 font-medium">{user.country || "Not set"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}