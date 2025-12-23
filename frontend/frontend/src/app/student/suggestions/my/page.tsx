"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Suggestion {
  id: number;
  title: string;
  department: string;
  description: string;
  status: string;
  admin_reply?: string;
}

export default function MySuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    axios
      .get("http://127.0.0.1:5000/api/suggestions/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSuggestions(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4 py-10">
      <section className="max-w-4xl mx-auto bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 animate-float">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 dark:text-white">
          My Suggestions
        </h1>

        <div className="space-y-6">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl bg-white/90 dark:bg-slate-900 p-6 shadow-md"
            >
              <h2 className="text-xl font-bold">{s.title}</h2>
              <p className="text-sm text-gray-500">{s.department}</p>

              <p className="mt-3">{s.description}</p>

              <p className="mt-3 font-medium">
                Status:{" "}
                <span
                  className={
                    s.status === "under review"
                      ? "text-yellow-500"
                      : s.status === "accepted"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {s.status}
                </span>
              </p>

              {s.admin_reply && (
                <p className="mt-3 text-sm">
                  <strong>Admin Reply:</strong> {s.admin_reply}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
