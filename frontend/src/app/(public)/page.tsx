import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">Free Online Certificates</h1>
      <p className="mt-3 text-gray-600">Learn, get assessed, and earn a verifiable certificate.</p>
      <Link href="/courses" className="mt-6 inline-block rounded bg-black px-4 py-2 text-white">
        Browse courses
      </Link>
    </main>
  );
}
