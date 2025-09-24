"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:5000/api/complaints/all";

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Admin token not found. Please login again.");
        setLoading(false);
        return;
      }
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReply = async (id) => {
    const reply = prompt("Enter your reply:");
    if (!reply) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `http://127.0.0.1:5000/api/complaints/${id}/reply`,
        { reply, status: "resolved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      alert("Error sending reply.");
    }
  };

  const handleTerminate = async (id) => {
    if (!confirm("Are you sure you want to terminate this complaint?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `http://127.0.0.1:5000/api/complaints/${id}/reply`,
        { status: "terminated" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      alert("Error terminating complaint.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-700">Loading complaints…</p>;

  if (error)
    return (
      <div className="text-center mt-10 text-red-600">
        {error}
        <button
          onClick={fetchData}
          className="ml-4 px-3 py-1 bg-blue-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Complaints Dashboard
      </h1>

      {complaints.length === 0 ? (
        <p className="text-center text-gray-500">No complaints available.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b">Title</th>
                <th className="py-3 px-4 border-b">Student ID</th>
                <th className="py-3 px-4 border-b">Department</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-gray-800">{c.title}</td>
                  <td className="py-3 px-4 border-b text-gray-600">{c.student_id}</td>
                  <td className="py-3 px-4 border-b text-gray-600">{c.department}</td>
                  <td
                    className={`py-3 px-4 border-b font-semibold ${
                      c.status === "resolved"
                        ? "text-green-600"
                        : c.status === "terminated"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {c.status}
                  </td>
                  <td className="py-3 px-4 border-b space-x-2">
                    <button
                      onClick={() => handleReply(c.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => handleTerminate(c.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Terminate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
