"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { staffLogin } from "@/lib/staff/api";

export default function StaffLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await staffLogin(email, password);
      router.push("/staff");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="mx-auto mt-24 max-w-sm rounded-lg border bg-white p-6">
      <h1 className="text-xl font-bold">Staff sign in</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input className="w-full rounded border p-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-black p-2 text-white">Sign in</button>
      </form>
    </main>
  );
}
