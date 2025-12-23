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
    <main className="
        min-h-screen w-full
        flex items-center justify-center
        bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        px-4
      "
      >
       {/* Floating Glass Card */}
      <section
        className="
          w-full max-w-2xl
          bg-white/70 dark:bg-slate-800/80
          backdrop-blur-lg
          rounded-3xl
          shadow-xl
          p-6 sm:p-8 md:p-10
          animate-float
        "
      >
        <h1
          className="
            mb-8 text-center font-extrabold tracking-tight
            text-gray-800 dark:text-slate-100
            text-[clamp(1.8rem,4vw,2.5rem)]
          "
        >
          Submit a New Suggestion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Complaint title"
            className="
              w-full rounded-xl border border-gray-300
              bg-white/90 dark:bg-slate-900
              px-4 py-3 text-gray-800 dark:text-white
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-sky-400
            "
          />

          {/* Department */}
          <select
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="
              w-full rounded-xl border border-gray-300
              bg-white/90 dark:bg-slate-900
              px-4 py-3 text-gray-800 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-sky-400
            "
          >
            <option value="" disabled>
              Select department
            </option>
            <option value="student_affairs">Student Affairs</option>
            <option value="academics">Academics</option>
          </select>

          {/* Description */}
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your complaint clearly..."
            className="
              w-full rounded-xl border border-gray-300
              bg-white/90 dark:bg-slate-900
              px-4 py-3 text-gray-800 dark:text-white
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-sky-400
            "
          />

          {/* File Upload */}
          <input
            type="file"
            onChange={handleFileChange}
            className="
              w-full text-sm text-slate-600 dark:text-slate-300
              file:mr-4 file:rounded-full
              file:border-0 file:px-4 file:py-2
              file:bg-sky-100 file:text-sky-700
              hover:file:bg-sky-200
            "
          />

          {file && (
            <p className="text-sm text-emerald-600">
              ✅ Selected file: {file.name}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="
              w-full rounded-xl
              bg-gradient-to-r from-sky-500 to-indigo-500
              py-3 font-semibold text-white
              transition-all duration-300
              hover:scale-[1.02] hover:shadow-lg
            "
          >
            Proceed to Review
          </button>
        </form>
     </section>
    </main>
  );
}