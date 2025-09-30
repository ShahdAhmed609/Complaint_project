"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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

  if (loading) return <p className="text-center mt-10">Loading complaints…</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">All Complaints</h1>

      {complaints.length === 0 ? (
        <p className="text-center text-gray-500">No complaints available.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-black">Title</th>
                <th className="py-3 px-4 border-b text-black">Student</th>
                <th className="py-3 px-4 border-b text-black">Department</th>
                <th className="py-3 px-4 border-b text-black">Status</th>
                <th className="py-3 px-4 border-b text-black">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-black">{c.title}</td>
                  <td className="py-3 px-4 border-b text-black">{c.student_id}</td>
                  <td className="py-3 px-4 border-b text-black">{c.department}</td>
                  <td className="py-3 px-4 border-b text-black">{c.status}</td>
                  <td className="py-3 px-4 border-b text-black">
                    <Link
                      href={`/admin/complaints/${c.id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View / Manage
                    </Link>
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
