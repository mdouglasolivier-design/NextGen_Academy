"use client";
import { useEffect, useState } from "react";
import { staffApi } from "@/lib/staff/api";

interface Entry { action: string; detail: string; at: string; ip: string | null }

export default function ActivityPage() {
  const [rows, setRows] = useState<Entry[]>([]);
  useEffect(() => {
    staffApi<Entry[]>("/staff/activity/").then(setRows).catch(() => setRows([]));
  }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My activity log</h1>
      <div className="rounded-lg border bg-white">
        {rows.length === 0 && <p className="p-4 text-sm text-gray-500">No activity recorded yet.</p>}
        {rows.map((r, i) => (
          <div key={i} className="border-b p-3 text-sm last:border-0">
            <b>{r.action}</b> {r.detail && <span className="text-gray-600">· {r.detail}</span>}
            <div className="text-xs text-gray-400">{new Date(r.at).toLocaleString()} {r.ip && `· ${r.ip}`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
