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
    // ✅ تحميل البيانات النصية
    const storedData = sessionStorage.getItem("complaintData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setData(parsed);
    } else {
      router.push("/student/complaints/new");
    }

    // ✅ تحميل الملف من sessionStorage (base64 → File)
    const storedFile = sessionStorage.getItem("uploadedFile");
    if (storedFile) {
      const parsed = JSON.parse(storedFile);
      const byteString = atob(parsed.data.split(",")[1]); // نفصل الـ header عن الداتا
      const mimeString = parsed.type;
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const newFile = new File([ab], parsed.name, { type: mimeString });
      setFile(newFile);
    }
  }, [router]);

  const handleSubmit = async () => {
    if (!data) return;

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("department", data.department);
      formData.append("description", data.description);
      if (data.suggestion) formData.append("suggestion", data.suggestion);

      if (file) {
        formData.append("file", file); // ✅ الملف الحقيقي يتبعت هنا
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
          <h2 className="font-semibold text-black">Title:</h2>
          <p className="text-black">{data.title}</p>
        </div>
        <div>
          <h2 className="font-semibold text-black">Department:</h2>
          <p className="text-black">{data.department}</p>
        </div>
        <div>
          <h2 className="font-semibold text-black">Description:</h2>
          <p className="text-black">{data.description}</p>
        </div>
        <div>
          <h2 className="font-semibold text-black">File:</h2>
          <p className="text-black">{file ? file.name : "No file attached"}</p>
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
