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
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const { data } = await axios.get<Complaint[]>(
          "http://127.0.0.1:5000/api/complaints/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComplaints(data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <p className="p-8">Loading your complaints...</p>;

  if (complaints.length === 0)
    return <p className="p-8">You have not submitted any complaints yet.</p>;

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-8">
      <div className="w-full max-w-3xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">My Complaints</h1>
        <div className="space-y-6">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <h2 className="text-xl font-semibold">{c.title}</h2>
              <p className="text-sm text-gray-600">Dept: {c.department}</p>
              <p className="mt-2">{c.description}</p>
              {c.suggestion && (
                <p className="mt-2 text-sm text-gray-700">
                  Suggestion: {c.suggestion}
                </p>
              )}
              {c.file_path && (
                <a
                  href={`http://127.0.0.1:5000/api/complaints/files/${c.file_path.split("/").pop()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-blue-600 underline"
                >
                  View Attachment
                </a>
              )}
              <p className="mt-2 text-sm font-medium">
                Status:{" "}
                <span
                  className={
                    c.status === "pending"
                      ? "text-yellow-600"
                      : c.status === "resolved"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {c.status}
                </span>
              </p>
              {c.reply && (
                <p className="mt-2 text-sm text-gray-700">
                  <strong>Admin Reply:</strong> {c.reply}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
