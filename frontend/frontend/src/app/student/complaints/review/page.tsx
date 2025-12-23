"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ComplaintData {
  title: string;
  department: string;
  description: string;
  suggestion?: string;
  fileName?: string;
}

export default function ReviewComplaintPage() {
  const [data, setData] = useState<ComplaintData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = sessionStorage.getItem("complaintData");
    if (!storedData) return router.push("/student/complaints/new");
    setData(JSON.parse(storedData));

    const storedFile = sessionStorage.getItem("uploadedFile");
    if (storedFile) {
      const parsed = JSON.parse(storedFile);
      const byteString = atob(parsed.data.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      setFile(new File([ab], parsed.name, { type: parsed.type }));
    }
  }, [router]);

  const handleSubmit = async () => {
    if (!data) return;

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => v && formData.append(k, v));
      if (file) formData.append("file", file);

      const token = localStorage.getItem("studentToken");

      const res = await fetch("http://127.0.0.1:5000/api/complaints/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error();
      router.push("/student/complaints/success");
    } catch {
      alert("❌ Failed to submit complaint");
    }
  };

  if (!data) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <section className="w-full max-w-2xl bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 animate-float">
        <h1 className="text-center text-3xl font-extrabold mb-8 text-gray-800 dark:text-white">
          Review your complaint
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