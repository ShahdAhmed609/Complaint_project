"use client";
import { useEffect, useState } from "react";

interface Suggestion {
  id: number;
  title: string;
  department: string;
  description: string;
  file_path?: string;
  status: "under review" | "accepted" | "rejected";
  admin_reply?: string;
}

export default function MySuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No auth token found");

        const res = await fetch("http://127.0.0.1:5000/api/suggestions/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch suggestions");

        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (loading) return <p className="p-8">Loading your suggestions...</p>;

  if (suggestions.length === 0)
    return <p className="p-8">You have not submitted any suggestions yet.</p>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "under review":
        return "text-yellow-600";
      case "accepted":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-8">
      <div className="w-full max-w-3xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-slate-800">
          My Suggestions
        </h1>
        <div className="space-y-6">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="rounded-lg border border-gray-200 p-4 shadow-sm"
            >
              <h2 className="text-xl text-black font-semibold">{s.title}</h2>
              <p className="text-sm text-gray-600">Dept: {s.department}</p>
              <p className="mt-2 text-black">{s.description}</p>
              {s.file_path && (
                <a
                  href={`http://127.0.0.1:5000/api/suggestions/files/${s.file_path.split("/").pop()}`}
                  target="_blank"
                  className="mt-2 block text-blue-600 underline"
                >
                  View Attachment
                </a>
              )}
              <p className="mt-2 text-black text-sm font-medium">
                Status:{" "}
                <span className={getStatusColor(s.status)}>{s.status}</span>
              </p>
              {s.admin_reply && (
                <p className="mt-2 text-sm text-gray-700">
                  <strong>Admin Reply:</strong> {s.admin_reply}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
