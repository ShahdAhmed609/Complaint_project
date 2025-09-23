"use client";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-md space-y-6">
        <h1 className="text-center text-3xl font-bold text-slate-800">
          Student Dashboard
        </h1>

        <button
          onClick={() => router.push("/student/complaints/new")}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white"
        >
          Submit New Complaint
        </button>

        <button
          onClick={() => router.push("/student/complaints/my")}
          className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white"
        >
          View My Complaints
        </button>
      </div>
    </main>
  );
}
