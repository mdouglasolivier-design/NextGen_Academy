"use client";
import { useEffect, useState } from "react";
import { staffApi } from "@/lib/staff/api";

interface Entry { action: string; detail: string; at: string; ip: string | null }

export default function ActivityPage() {
  const [rows, setRows] = useState<Entry[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    staffApi<Entry[]>("/staff/activity/").then(setRows).catch(() => setFailed(true));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">My activity log</h1>
        <p className="mt-2 text-ink-soft">The most recent actions recorded on your account.</p>
      </div>

      {failed ? (
        <p role="alert" className="rounded-[14px] border border-rule bg-surface p-5 text-ink-soft">
          The activity log isn&rsquo;t loading right now. Refresh the page to try again.
        </p>
      ) : rows === null ? (
        <p className="text-muted" role="status">Loading&hellip;</p>
      ) : rows.length === 0 ? (
        <p className="rounded-[14px] border border-rule bg-surface p-5 text-ink-soft">
          Nothing recorded yet. Your actions will show up here.
        </p>
      ) : (
        <ul className="divide-y divide-rule rounded-[14px] border border-rule bg-surface">
          {rows.map((r, i) => (
            <li key={i} className="px-5 py-3.5 text-[15px]">
              <p>
                <span className="font-medium">{r.action}</span>
                {r.detail && <span className="text-ink-soft">: {r.detail}</span>}
              </p>
              <p className="mt-0.5 text-sm text-muted">
                {new Date(r.at).toLocaleString()}
                {r.ip && `, from ${r.ip}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
