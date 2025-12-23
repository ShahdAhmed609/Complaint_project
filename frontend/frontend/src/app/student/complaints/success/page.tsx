"use client";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <section className="w-full max-w-md bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 text-center animate-float">
        <h1 className="text-3xl font-extrabold text-emerald-500 mb-4">
          🎉 Submitted Successfully!
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-8">
          Your complaint has been submitted. You can track its progress anytime.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/student/complaints/my")}
            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-400 py-3 font-semibold text-white hover:scale-105 transition"
          >
            My Complaints
          </button>
          <button
            onClick={() => router.push("/student/dashboard")}
            className="flex-1 rounded-xl bg-gray-200 dark:bg-slate-700 py-3 font-semibold hover:scale-105 transition"
          >
            Dashboard
          </button>
        </div>
      </section>
    </main>
  );
}
