"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ComplaintData {
  title: string;
  department: string;
  description: string;
  fileName?: string;
  file?: File;
}

export default function ReviewComplaintPage() {
  const [data, setData] = useState<ComplaintData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = sessionStorage.getItem("complaintData");
    if (storedData) setData(JSON.parse(storedData));
    else router.push("/student/complaints/new"); // ✅ صححت المسار
  }, [router]);

  const handleSubmit = async () => {
    if (!data) return;

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("department", data.department);
      formData.append("description", data.description);
      if (data.file) {
        formData.append("file", data.file);
      }

      const token = localStorage.getItem("authToken");

      const res = await fetch("http://127.0.0.1:5000/api/complaints/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Response Error Body:", errText);
        throw new Error("Failed to submit complaint");
      }

      const result = await res.json();
      console.log("✅ Server Response JSON:", result);

      // ✅ بدل الـ alert نوديه على صفحة النجاح
      router.push("/student/complaints/success");
    } catch (err) {
      console.error("🔥 Submit Error:", err);
      alert("❌ Failed to submit complaint");
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">
          Review Submission
        </h1>
        <div className="space-y-4">
          <div>
            <h2>Title:</h2>
            <p>{data.title}</p>
          </div>
          <div>
            <h2>Department:</h2>
            <p>{data.department}</p>
          </div>
          <div>
            <h2>Description:</h2>
            <p>{data.description}</p>
          </div>
          <div>
            <h2>File:</h2>
            <p>{data.fileName}</p>
          </div>
        </div>
        <div className="mt-8 flex justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 rounded-lg bg-gray-300 px-4 py-3 font-semibold"
          >
            Back to Edit
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white"
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </main>
  );
}
