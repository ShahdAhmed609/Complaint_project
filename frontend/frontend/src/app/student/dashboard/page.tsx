"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function StudentDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    const role = localStorage.getItem("studentRole");

    if (!token || role !== "student") {
      router.replace("/student/login");
    }
  }, [router]);

  const buttonBase = `
    w-full h-28 sm:h-32
    text-lg font-semibold text-white
    rounded-2xl shadow-lg
    transition-all duration-300
    hover:scale-105 hover:shadow-xl
  `;

  return (
    <main
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        px-4 sm:px-6 lg:px-8
      "
    >
      {/* Floating Dashboard Card */}
      <section
        className="
          w-full max-w-5xl
          bg-white/70 dark:bg-slate-800/80
          backdrop-blur-md
          rounded-3xl
          shadow-xl dark:shadow-2xl
          p-6 sm:p-8 md:p-12
          animate-float
        "
      >
        <h1
          className="
            text-center font-extrabold tracking-tight mb-12
            text-gray-800 dark:text-slate-100
            text-[clamp(2rem,4vw,3rem)]
          "
        >
          Student Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => router.push("/student/complaints/new")}
            className={`${buttonBase} bg-gradient-to-r from-blue-500 to-sky-400`}
          >
            Submit New Complaint
          </button>

          <button
            onClick={() => router.push("/student/complaints/my")}
            className={`${buttonBase} bg-gradient-to-r from-emerald-500 to-green-400`}
          >
            View My Complaints
          </button>

          <button
            onClick={() => router.push("/student/suggestions/new")}
            className={`${buttonBase} bg-gradient-to-r from-purple-500 to-indigo-400`}
          >
            Submit New Suggestion
          </button>

          <button
            onClick={() => router.push("/student/suggestions/my")}
            className={`${buttonBase} bg-gradient-to-r from-pink-500 to-rose-400`}
          >
            View My Suggestions
          </button>
        </div>
      </section>
    </main>
  );
}