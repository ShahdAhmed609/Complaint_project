"use client";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const buttonBase =
    "w-full rounded-lg px-4 py-3 font-semibold text-white transition-colors";

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-md space-y-6">
        <h1 className="text-center text-3xl font-bold text-slate-800">
          Student Dashboard
        </h1>

        <button
          onClick={() => router.push("/student/complaints/new")}
          className={`${buttonBase} bg-indigo-600 hover:bg-indigo-700`}
        >
          Submit New Complaint
        </button>

        <button
          onClick={() => router.push("/student/complaints/my")}
          className={`${buttonBase} bg-green-600 hover:bg-green-700`}
        >
          View My Complaints
        </button>

        <button
          onClick={() => router.push("/student/suggestions/new")}
          className={`${buttonBase} bg-purple-600 hover:bg-purple-700`}
        >
          Submit New Suggestion
        </button>

        <button
          onClick={() => router.push("/student/suggestions/my")}
          className={`${buttonBase} bg-pink-600 hover:bg-pink-700`}
        >
          View My Suggestions
        </button>
      </div>
    </main>
  );
}
