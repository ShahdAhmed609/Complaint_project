// src/app/student/complaints/new/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewComplaintPage() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  // ✅ تحميل البيانات المحفوظة لو رجع من review
  useEffect(() => {
    const saved = sessionStorage.getItem("complaintData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTitle(parsed.title || "");
      setDepartment(parsed.department || "");
      setDescription(parsed.description || "");
    }
  }, []);

  // ✅ تخزين الملف في state و sessionStorage
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    setFile(selectedFile);

    // نخزن بيانات الملف مؤقتًا كـ Base64 في sessionStorage
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem(
        "uploadedFile",
        JSON.stringify({
          name: selectedFile.name,
          type: selectedFile.type,
          data: reader.result, // base64 data
        })
      );
    };
    reader.readAsDataURL(selectedFile);
  };

  // ✅ حفظ البيانات النصية في sessionStorage والانتقال للـ review
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const complaintData = {
      title,
      department,
      description,
      fileName: file ? file.name : null, // مجرد الاسم للعرض
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
            className="block w-full border rounded text-black placeholder-grey shadow-sm"
          />

          <select
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="block w-full border rounded text-black placeholder-grey shadow-sm"
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
            className="block w-full border rounded text-black placeholder-grey shadow-sm"
          ></textarea>

          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0"
          />

          {file && (
            <p className="text-green-600 text-sm">
              ✅ Selected file: {file.name}
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
