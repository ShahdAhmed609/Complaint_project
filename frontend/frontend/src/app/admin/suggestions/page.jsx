"use client";
import { useEffect, useState } from "react";

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [statusText, setStatusText] = useState({});

  // Fetch all suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      const token = localStorage.getItem("adminToken"); // ✅ استخدم توكن الأدمن
      if (!token) {
        alert("Unauthorized! Please login as admin.");
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:5000/api/suggestions/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSuggestions(data);

        // Initialize reply & status states
        const initialReply = {};
        const initialStatus = {};
        data.forEach((s) => {
          initialReply[s.id] = s.admin_reply || "";
          initialStatus[s.id] = s.status || "under review";
        });
        setReplyText(initialReply);
        setStatusText(initialStatus);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleReplyChange = (id, value) => {
    setReplyText((prev) => ({ ...prev, [id]: value }));
  };

  const handleStatusChange = (id, value) => {
    setStatusText((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitReply = async (id) => {
    const token = localStorage.getItem("adminToken"); // ✅ برضو هنا
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/suggestions/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          admin_reply: replyText[id],
          status: statusText[id],
        }),
      });
      if (!res.ok) throw new Error("Failed to send reply");

      // Update state after successful reply
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, admin_reply: replyText[id], status: statusText[id] } : s
        )
      );

      alert("✅ Reply sent successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send reply");
    }
  };

  if (loading) return <p>Loading suggestions...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">All Suggestions</h1>
      {suggestions.map((s) => (
        <div key={s.id} className="bg-white p-4 rounded shadow space-y-2">
          <p><strong>Title:</strong> {s.title}</p>
          <p><strong>Student ID:</strong> {s.student_id}</p>
          <p><strong>Department:</strong> {s.department}</p>
          <p><strong>Description:</strong> {s.description}</p>
          <p><strong>Status:</strong> {s.status}</p>
          <p><strong>Reply:</strong> {s.admin_reply || "No reply yet"}</p>

          {s.file_path && (
            <p>
              <strong>File:</strong>{" "}
              <a
                href={`http://127.0.0.1:5000/api/suggestions/files/${s.file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {s.file_path}
              </a>
            </p>
          )}

          <textarea
            placeholder="Write your reply here"
            value={replyText[s.id]}
            onChange={(e) => handleReplyChange(s.id, e.target.value)}
            className="w-full border rounded p-2"
          />

          <select
            value={statusText[s.id]}
            onChange={(e) => handleStatusChange(s.id, e.target.value)}
            className="w-full mt-2 border rounded p-2"
          >
            <option value="under review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={() => handleSubmitReply(s.id)}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Send Reply
          </button>
        </div>
      ))}
    </div>
  );
}
//