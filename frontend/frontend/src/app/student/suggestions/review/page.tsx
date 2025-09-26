"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewSuggestionPage() {
  const [data, setData] = useState<{
    title: string;
    department: string;
    description: string;
    fileName?: string | null;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem("suggestionData");
    if (!saved) {
      router.push("/student/suggestions");
      return;
    }
    setData(JSON.parse(saved));
  }, [router]);

  const handleSubmit = async () => {
    if (!data) return;

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("department", data.department);
      formData.append("description", data.description);

      const fileData = sessionStorage.getItem("uploadedSuggestionFile");
      if (fileData) {
        const parsed = JSON.parse(fileData);
        const byteString = atob(parsed.data.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const file = new File([ab], parsed.name, { type: parsed.type });
        formData.append("file", file);
      }

      const token = localStorage.getItem("authToken");
      const res = await fetch("http://127.0.0.1:5000/api/suggestions/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit suggestion");

      router.push("/student/suggestions/success");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit suggestion");
    }
  };

  if (!data) return null;

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">
          Review Your Suggestion
        </h1>
        <p><strong>Title:</strong> {data.title}</p>
        <p><strong>Department:</strong> {data.department}</p>
        <p><strong>Description:</strong> {data.description}</p>
        {data.fileName && <p><strong>File:</strong> {data.fileName}</p>}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/student/suggestions")}
            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </main>
  );
}
