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
    const storedData = sessionStorage.getItem("suggestionData");
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      router.replace("/student/suggestions/new");
      return;
    }

    const storedFile = sessionStorage.getItem("uploadedSuggestionFile");
    if (storedFile) {
      const parsed = JSON.parse(storedFile);
      const byteString = atob(parsed.data.split(",")[1]);
      const mimeString = parsed.type;
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const newFile = new File([ab], parsed.name, { type: mimeString });
      setFile(newFile);
    }
  }, [router]);

  const handleSubmit = async () => {
    if (!data) return;

    const token = localStorage.getItem("studentToken");
    if (!token) {
      alert("⚠️ Session expired. Please log in again.");
      router.replace("/login");
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

      sessionStorage.removeItem("suggestionData");
      sessionStorage.removeItem("uploadedSuggestionFile");

      router.replace("/student/suggestions/success");
    } catch (err: any) {
      console.error("🔥 Submit Error:", err);
      const message =
        err.response?.data?.message || "❌ Failed to submit suggestion";
      alert(message);
    }
  };

  if (!data) return <p>Loading...</p>;

 return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <section className="w-full max-w-2xl bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 animate-float">
        <h1 className="text-center text-3xl font-extrabold mb-8 text-gray-800 dark:text-white">
          Review your Suggestion
        </h1>

        <div className="space-y-4 text-gray-700 dark:text-gray-200">
          <Info label="Title" value={data.title} />
          <Info label="Department" value={data.department} />
          <Info label="Description" value={data.description} />
          <Info label="File" value={file ? file.name : "No file attached"} />
        </div>

        <div className="mt-10 flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 rounded-xl bg-gray-200 dark:bg-slate-700 py-3 font-semibold hover:scale-105 transition"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 py-3 font-semibold text-white hover:scale-105 transition"
          >
            Confirm & Submit
          </button>
        </div>
      </section>
    </main>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold">{label}</p>
      <p>{value}</p>
    </div>
  );
}