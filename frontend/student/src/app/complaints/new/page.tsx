"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Complaint {
  id: number;
  title: string;
  department: string;
  description: string;
  suggestion?: string;
  file_path?: string;
  status: string;
  reply?: string;
}

export default function NewComplaintPage() {
 
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [previousComplaints, setPreviousComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  
  useEffect(() => {
    
    const savedFormData = sessionStorage.getItem("complaintData");
    if (savedFormData) {
      const complaint = JSON.parse(savedFormData);
      setTitle(complaint.title);
      setDepartment(complaint.department);
      setDescription(complaint.description);
    }

    const fetchPreviousComplaints = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:5000/api/complaints/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPreviousComplaints(response.data || []);
      } catch (error) {
        console.error("Failed to fetch previous complaints:", error);
        setPreviousComplaints([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreviousComplaints();
  }, [router]);

  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const complaintData = {
      title,
      department,
      description,
      fileName: file ? file.name : "No file attached",
    };
    sessionStorage.setItem("complaintData", JSON.stringify(complaintData));
    router.push("/complaints/review");
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-100 p-8 space-y-8">
 
      <div className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-slate-800">
          Your Complaint History
        </h1>
        {isLoading ? (
          <p>Loading previous complaints...</p>
        ) : previousComplaints.length > 0 ? (
          <div className="space-y-4">
            {previousComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-slate-700">
                    {complaint.title}
                  </p>
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                      complaint.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </div>
                {complaint.reply && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Admin Reply:</strong> {complaint.reply}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't submitted any complaints yet.</p>
        )}
      </div>


      <div className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">
          Submit a New Complaint/Suggestion
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="block w-full rounded-md border-gray-300 shadow-sm"
          />
          <select
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="" disabled>
              Select a department
            </option>
            <option value="student_affairs">Student Affairs</option>
            <option value="academics">Academics</option>
          </select>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="block w-full rounded-md border-gray-300 shadow-sm"
          ></textarea>
          <input
            type="file"
            onChange={(e) =>
              setFile(e.target.files ? e.target.files[0] : null)
            }
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0"
          />
          <button
            type="submit"
            className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white"
          >
            Proceed to Review
          </button>
        </form>
      </div>
    </main>
  );
}