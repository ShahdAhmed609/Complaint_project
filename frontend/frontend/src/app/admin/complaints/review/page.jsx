"use client";
import { useEffect, useState } from "react";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [statusText, setStatusText] = useState({});

  // Fetch all complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("adminToken"); // ✅ جبت التوكن بتاع الأدمن
      try {
        const res = await fetch("http://127.0.0.1:5000/api/complaints/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setComplaints(data);

        // Initialize reply & status states
        const initialReply = {};
        const initialStatus = {};
        data.forEach(c => {
          initialReply[c.id] = c.reply || "";
          initialStatus[c.id] = c.status || "pending";
        });
        setReplyText(initialReply);
        setStatusText(initialStatus);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleReplyChange = (id, value) => {
    setReplyText(prev => ({ ...prev, [id]: value }));
  };

  const handleStatusChange = (id, value) => {
    setStatusText(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmitReply = async (id) => {
    const token = localStorage.getItem("adminToken"); // ✅ برده استخدمت adminToken
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/complaints/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply: replyText[id], status: statusText[id] }),
      });
      if (!res.ok) throw new Error("Failed to send reply");

      // Update state after successful reply
      setComplaints(prev =>
        prev.map(c =>
          c.id === id ? { ...c, reply: replyText[id], status: statusText[id] } : c
        )
      );

      alert("✅ Reply sent successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send reply");
    }
  };

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">All Complaints</h1>
      {complaints.map((c) => (
        <div key={c.id} className="bg-white p-4 rounded shadow space-y-2">
          <p><strong>Title:</strong> {c.title}</p>
          <p><strong>Student ID:</strong> {c.student_id}</p>
          <p><strong>Department:</strong> {c.department}</p>
          <p><strong>Description:</strong> {c.description}</p>
          <p><strong>Suggestion:</strong> {c.suggestion || "N/A"}</p>
          <p><strong>Status:</strong> {c.status}</p>
          <p><strong>Reply:</strong> {c.reply || "No reply yet"}</p>

          {c.file_path && (
            <p>
              <strong>File:</strong>{" "}
              <a
                href={`http://127.0.0.1:5000/api/complaints/files/${c.file_path.split("/").pop()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {c.file_path.split("/").pop()}
              </a>
            </p>
          )}

          <textarea
            placeholder="Write your reply here"
            value={replyText[c.id]}
            onChange={(e) => handleReplyChange(c.id, e.target.value)}
            className="w-full border rounded p-2"
          />

          <select
            value={statusText[c.id]}
            onChange={(e) => handleStatusChange(c.id, e.target.value)}
            className="w-full mt-2 border rounded p-2"
          >
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="terminated">Terminated</option>
          </select>

          <button
            onClick={() => handleSubmitReply(c.id)}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Send Reply
          </button>
        </div>
      ))}
    </div>
  );
}
