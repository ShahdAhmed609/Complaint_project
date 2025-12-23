"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function ComplaintDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState(null);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://127.0.0.1:5000/api/complaints/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = res.data.find((c) => c.id == id);
        setComplaint(found);
        if (found) {
          setStatus(found.status);
          setReply(found.reply || "");
        }
      } catch {
        setError("Failed to load complaint.");
      }
    };
    fetchComplaint();
  }, [id]);

  if (!complaint)
    return <p className="text-center mt-20">Loading complaint…</p>;

  const fileUrl = complaint.file_path
    ? `http://127.0.0.1:5000/api/complaints/files/${complaint.file_path}`
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4 py-10">
      <section className="max-w-3xl mx-auto bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 animate-float">
        <h1 className="text-2xl font-extrabold mb-6">📝 Complaint Details</h1>

        <div className="space-y-2 text-sm">
          <p><strong>Title:</strong> {complaint.title}</p>
          <p><strong>Description:</strong> {complaint.description}</p>
          <p><strong>Department:</strong> {complaint.department}</p>
          <p><strong>Status:</strong> {complaint.status}</p>
          <p><strong>Admin Reply:</strong> {complaint.reply || "N/A"}</p>
        </div>

        {fileUrl && (
          <div className="mt-4">
            <p className="font-medium">📎 Attachment</p>
            {/\.(jpg|jpeg|png|gif)$/i.test(fileUrl) ? (
              <img src={fileUrl} className="mt-2 rounded-xl max-h-64" />
            ) : (
              <a href={fileUrl} target="_blank" className="text-indigo-600 underline">
                View / Download File
              </a>
            )}
          </div>
        )}

        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            const token = localStorage.getItem("adminToken");
            await axios.post(
              `http://127.0.0.1:5000/api/complaints/${id}/reply`,
              { reply, status },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess("Reply saved successfully.");
            setComplaint({ ...complaint, reply, status });
          } catch {
            setError("Failed to save reply.");
          }
        }} className="mt-8 space-y-4">

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
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="terminated">Terminated</option>
          </select>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push("/admin/complaints")}
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
        {success && <p className="text-green-600 mt-4">{success}</p>}
      </section>
    </main>
  );
}
