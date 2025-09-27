// src/app/student/suggestions/review/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface SuggestionData {
  title: string;
  department: string;
  description: string;
  fileName?: string;
}

export default function ReviewSuggestionPage() {
  const [data, setData] = useState<SuggestionData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    // ✅ تحميل البيانات النصية من sessionStorage
    const storedData = sessionStorage.getItem("suggestionData");
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      router.push("/student/suggestions");
      return;
    }

    // ✅ تحميل الملف من sessionStorage (base64 → File)
    const storedFile = sessionStorage.getItem("uploadedSuggestionFile");
    if (storedFile) {
      const parsed = JSON.parse(storedFile);
      const byteString = atob(parsed.data.split(",")[1]);
      const mimeString = parsed.type;
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i);
      const newFile = new File([ab], parsed.name, { type: mimeString });
      setFile(newFile);
    }
  }, [router]);

  const handleSubmit = async () => {
    if (!data) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("⚠️ Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("department", data.department);
      formData.append("description", data.description);
      if (file) formData.append("file", file);

      await axios.post(
        "http://127.0.0.1:5000/api/suggestions/create",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ مسح البيانات بعد الإرسال
      sessionStorage.removeItem("suggestionData");
      sessionStorage.removeItem("uploadedSuggestionFile");

      router.push("/student/suggestions/success");
    } catch (err: any) {
      console.error("🔥 Submit Error:", err);
      const message =
        err.response?.data?.message || "❌ Failed to submit suggestion";
      alert(message);
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">
          Review Your Suggestion
        </h1>

        <div className="space-y-4">
          <div>
            <h2 className="font-semibold text-slate-700">Title:</h2>
            <p>{data.title}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-700">Department:</h2>
            <p>{data.department}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-700">Description:</h2>
            <p>{data.description}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-700">File:</h2>
            <p>{file ? file.name : "No file attached"}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 rounded-lg bg-gray-300 px-4 py-3 font-semibold hover:bg-gray-400"
          >
            Back to Edit
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    </main>
  );
}
