import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold">
          AI Appointment System
        </h1>

        <p className="mt-4 text-zinc-400">
          Smart healthcare appointment management powered by AI.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-medium hover:bg-indigo-500"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}