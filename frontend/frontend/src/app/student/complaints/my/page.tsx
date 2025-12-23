"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Complaint {
  id: number;
  title: string;
  department: string;
  description: string;
  suggestion?: string;
  file_path?: string;
  status: string;
  reply?: string;
}

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    axios
      .get("http://127.0.0.1:5000/api/complaints/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setComplaints(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4 py-10">
      <section className="max-w-4xl mx-auto bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 animate-float">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 dark:text-white">
          My Complaints
        </h1>

        <div className="space-y-6">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl bg-white/90 dark:bg-slate-900 p-6 shadow-md"
            >
              <h2 className="text-xl font-bold">{c.title}</h2>
              <p className="text-sm text-gray-500">{c.department}</p>

              <p className="mt-3">{c.description}</p>

              <p className="mt-3 font-medium">
                Status:{" "}
                <span
                  className={
                    c.status === "pending"
                      ? "text-yellow-500"
                      : c.status === "resolved"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {c.status}
                </span>
              </p>

              {c.reply && (
                <p className="mt-3 text-sm">
                  <strong>Admin Reply:</strong> {c.reply}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}