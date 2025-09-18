"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // 📝 Fetch complaints from backend
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/complaints");
        setComplaints(res.data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    fetchData();
  }, []);

  const handleReply = async (id) => {
    const reply = prompt("Enter your reply:");
    if (!reply) return;

    try {
      await axios.post(`http://localhost:5000/api/complaints/${id}/reply`, {
        reply,
      });
      alert("Reply submitted!");
    } catch (err) {
      console.error("Error replying:", err);
    }
  };

  const handleTerminate = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/complaints/${id}/terminate`);
      alert("Complaint terminated!");
    } catch (err) {
      console.error("Error terminating:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Complaints Dashboard
      </h1>

      {complaints.length === 0 ? (
        <p className="text-gray-600 text-center">No complaints available.</p>
      ) : (
        <ul className="space-y-4">
          {complaints.map((c) => (
            <li
              key={c.id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <h2 className="font-semibold text-lg">{c.title}</h2>
              <p className="text-sm text-gray-600">Dept: {c.department}</p>
              <p className="mt-2">{c.description}</p>
              {c.suggestions && (
                <p className="mt-2 italic text-gray-500">
                  Suggestion: {c.suggestions}
                </p>
              )}

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleReply(c.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Reply
                </button>
                <button
                  onClick={() => handleTerminate(c.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Terminate
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
