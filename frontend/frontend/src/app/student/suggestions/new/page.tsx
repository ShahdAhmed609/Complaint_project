"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewSuggestionPage() {
  const [title, setTitle] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  // تحميل البيانات المحفوظة إذا عاد المستخدم من صفحة المراجعة
  useEffect(() => {
    const saved = sessionStorage.getItem("suggestionData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTitle(parsed.title || "");
      setDepartment(parsed.department || "");
      setDescription(parsed.description || "");
    }
  }, []);

  // حفظ الملف في state وفي sessionStorage كـ Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem(
        "uploadedSuggestionFile",
        JSON.stringify({
          name: selectedFile.name,
          type: selectedFile.type,
          data: reader.result,
        })
      );
    };
    reader.readAsDataURL(selectedFile);
  };

  // حفظ البيانات مؤقتًا ثم الانتقال لصفحة المراجعة
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const suggestionData = {
      title,
      department,
      description,
      fileName: file ? file.name : null,
    };

    sessionStorage.setItem("suggestionData", JSON.stringify(suggestionData));
    router.push("/student/suggestions/review");
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 p-8">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">
          Submit a New Suggestion
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
