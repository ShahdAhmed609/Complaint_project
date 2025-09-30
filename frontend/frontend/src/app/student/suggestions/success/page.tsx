"use client";
import { useRouter } from "next/navigation";

export default function SuggestionSuccessPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md text-center">
        <h1 className="mb-4 text-2xl font-bold text-green-600">
          ✅ Suggestion Submitted Successfully!
        </h1>
        <p className="mb-6 text-gray-700">
          Your suggestion has been submitted. You can track its status anytime.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/student/suggestions/my")}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            View My Suggestions
          </button>
          <button
            onClick={() => router.push("/student/dashboard")}
            className="flex-1 rounded-lg bg-gray-300 px-4 py-3 font-semibold hover:bg-gray-400"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
