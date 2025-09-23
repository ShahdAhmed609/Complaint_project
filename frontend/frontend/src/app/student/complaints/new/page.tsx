// src/app/student/complaints/new/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewComplaintPage() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const router = useRouter();

  // ✅ تحميل البيانات المحفوظة لو رجع من review
  useEffect(() => {
    const saved = sessionStorage.getItem("complaintData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTitle(parsed.title || "");
      setDepartment(parsed.department || "");
      setDescription(parsed.description || "");
      if (parsed.fileName) {
        setUploadedFileUrl(parsed.fileUrl || null);
      }
    }
  }, []);

  // ✅ رفع الملف مباشرة للسيرفر عند اختياره
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;
    setFile(selectedFile);

    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/complaints/upload-temp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const result = await res.json();
      setUploadedFileUrl(result.fileUrl); // السيرفر بيرجع رابط الملف
    } catch (err) {
      console.error("❌ File upload error:", err);
      alert("Failed to upload file");
    }
  };

  // ✅ حفظ البيانات في sessionStorage والانتقال للـ review
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const complaintData = {
      title,
      department,
      description,
      fileName: file ? file.name : null,
      fileUrl: uploadedFileUrl, // رابط الملف المرفوع
    };

    sessionStorage.setItem("complaintData", JSON.stringify(complaintData));
    router.push("/student/complaints/review");
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">
          Submit a New Complaint
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
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0"
          />

          {uploadedFileUrl && (
            <p className="text-green-600 text-sm">
              ✅ File uploaded: <a href={uploadedFileUrl}>View</a>
            </p>
          )}

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
