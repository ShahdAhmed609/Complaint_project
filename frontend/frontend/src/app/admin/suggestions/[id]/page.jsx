"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function SuggestionDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [suggestion, setSuggestion] = useState(null);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("under review");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://127.0.0.1:5000/api/suggestions/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = res.data.find((s) => s.id == id);
        setSuggestion(found);
        if (found) setStatus(found.status);
      } catch {
        setError("Failed to load suggestion.");
      }
    };
    fetchSuggestion();
  }, [id]);

  if (!suggestion)
    return <p className="text-center mt-20">Loading suggestion…</p>;

  const fileUrl = suggestion.file_path
    ? `http://127.0.0.1:5000/api/suggestions/files/${suggestion.file_path}`
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4 py-10">
      <section className="max-w-3xl mx-auto bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 animate-float">
        <h1 className="text-2xl font-extrabold mb-6">💡 Suggestion Details</h1>

        <div className="space-y-2 text-sm">
          <p><strong>Title:</strong> {suggestion.title}</p>
          <p><strong>Description:</strong> {suggestion.description}</p>
          <p><strong>Department:</strong> {suggestion.department}</p>
          <p><strong>Status:</strong> {suggestion.status}</p>
          <p><strong>Admin Reply:</strong> {suggestion.admin_reply || "N/A"}</p>
        </div>

        {fileUrl && (
          <div className="mt-4">
            <p className="font-medium">📎 Attachment</p>
            {/\.(jpg|jpeg|png|gif)$/i.test(fileUrl) ? (
              <img src={fileUrl} className="mt-2 rounded-xl max-h-64" />
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                className="text-indigo-600 underline"
              >
                View / Download File
              </a>
            )}
          </div>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const token = localStorage.getItem("adminToken");
              await axios.post(
                `http://127.0.0.1:5000/api/suggestions/${id}/reply`,
                { admin_reply: reply, status },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              router.push("/admin/suggestions");
            } catch {
              setError("Failed to save reply.");
            }
          }}
          className="mt-8 space-y-4"
        >
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write admin reply..."
            className="w-full rounded-xl border p-3 bg-white/80 dark:bg-slate-900"
            rows="4"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border p-3 bg-white/80 dark:bg-slate-900"
          >
            <option value="under review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push("/admin/suggestions")}
              className="rounded-lg bg-slate-500 px-4 py-2 text-white hover:bg-slate-600"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
            >
              Save Reply
            </button>
          </div>
        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </section>
    </main>
  );
}
