"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:5000/api/suggestions/all";

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Admin token not found. Please login again.");
        return;
      }

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const statusOrder = { "under review": 1, accepted: 2, rejected: 3 };
      const sorted = res.data.sort((a, b) => {
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setSuggestions(sorted);
    } catch {
      setError("Failed to fetch suggestions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <p className="text-center mt-20 text-slate-600">Loading suggestions…</p>;

  if (error)
    return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4 py-10">
      <section className="max-w-7xl mx-auto bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 animate-float">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 dark:text-white">
          💡 All Suggestions
        </h1>

        {suggestions.length === 0 ? (
          <p className="text-center text-slate-500">No suggestions available.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow">
            <table className="min-w-full bg-white/90 dark:bg-slate-900">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  {["Title", "Student", "Department", "Status", "Created", "Action"].map((h) => (
                    <th
                      key={h}
                      className="py-3 px-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {suggestions.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <td className="py-3 px-4">{s.title}</td>
                    <td className="py-3 px-4">{s.student_id}</td>
                    <td className="py-3 px-4">{s.department}</td>
                    <td className="py-3 px-4">
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
                    </td>
                    <td className="py-3 px-4">
                      {new Date(s.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/suggestions/${s.id}`}
                        className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                      >
                        View / Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
