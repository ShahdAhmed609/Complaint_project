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
  const [success, setSuccess] = useState("");

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

  const handleReply = async (e) => {
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
  };

  if (!suggestion) return <p className="text-center mt-10">Loading suggestion…</p>;

  const fileUrl = suggestion.file_path
    ? `http://127.0.0.1:5000/api/suggestions/files/${suggestion.file_path}`
    : null;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-black">Suggestion Details</h1>
      <p className="text-black"><strong>Title:</strong> {suggestion.title}</p>
      <p className="text-black"><strong>Description:</strong> {suggestion.description}</p>
      <p className="text-black"><strong>Department:</strong> {suggestion.department}</p>
      <p className="text-black"><strong>Status:</strong> {suggestion.status}</p>
      <p className="text-black"><strong>Admin Reply:</strong> {suggestion.admin_reply || "N/A"}</p>

      {fileUrl && (
        <div className="mt-4">
          {/\.(jpg|jpeg|png|gif)$/i.test(fileUrl) ? (
            <img
              src={fileUrl}
              alt="Attachment"
              className="mt-2 max-h-64 border rounded"
            />
          ) : (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View / Download File
            </a>
          )}
        </div>
      )}

      <form onSubmit={handleReply} className="mt-6 space-y-4">
        <div>
          <label className="block font-medium text-black">Reply</label>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="w-full border rounded p-2 text-black placeholder-grey shadow-sm"
            rows="4"
          />
        </div>
        <div>
          <label className="block font-medium text-black">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded p-2 text-black placeholder-grey shadow-sm"
          >
            <option value="under review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.push("/admin/suggestions")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ← Back to Dashboard
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Reply
          </button>
        </div>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">{success}</p>}
    </div>
  );
}
