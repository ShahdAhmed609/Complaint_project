"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:5000/api/suggestions/all";

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

      // ترتيب الاقتراحات حسب الحالة أولًا ثم الأحدث
      const statusOrder = { "under review": 1, accepted: 2, rejected: 3 };
      const sortedSuggestions = res.data.sort((a, b) => {
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setSuggestions(sortedSuggestions);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading suggestions…</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">All Suggestions</h1>

      {suggestions.length === 0 ? (
        <p className="text-center text-gray-500">No suggestions available.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-black">Title</th>
                <th className="py-3 px-4 border-b text-black">Student</th>
                <th className="py-3 px-4 border-b text-black">Department</th>
                <th className="py-3 px-4 border-b text-black">Status</th>
                <th className="py-3 px-4 border-b text-black">Created At</th>
                <th className="py-3 px-4 border-b text-black">Action</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-black">{s.title}</td>
                  <td className="py-3 px-4 border-b text-black">{s.student_id}</td>
                  <td className="py-3 px-4 border-b text-black">{s.department}</td>
                  <td className="py-3 px-4 border-b text-black">{s.status}</td>
                  <td className="py-3 px-4 border-b text-black">
                    {new Date(s.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 border-b text-black">
                    <Link
                      href={`/admin/suggestions/${s.id}`}
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
