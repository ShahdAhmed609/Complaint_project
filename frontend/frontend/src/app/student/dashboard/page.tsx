"use client";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const buttonBase =
    "w-full h-28 text-lg font-semibold text-white rounded-xl shadow-md transition-transform hover:scale-105";

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-100 p-10">
      <div className="w-full max-w-5xl rounded-2xl bg-white p-12 shadow-lg">
        <h1 className="text-center text-4xl font-bold text-slate-800 mb-12">
          Student Dashboard
        </h1>

        <div className="grid grid-cols-2 gap-8">
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
      </div>
    </main>
  );
}
