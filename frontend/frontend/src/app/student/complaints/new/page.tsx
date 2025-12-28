"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function getJwtPayload(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function NewComplaintPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [authorized, setAuthorized] = useState(false);

  // 🔐 AUTH GUARD
  useEffect(() => {
    const token = localStorage.getItem("studentToken");

    if (!token) {
      router.replace("/student/login");
      return;
    }

    const payload = getJwtPayload(token);

    if (!payload || payload.role !== "student") {
      localStorage.removeItem("token");
      router.replace("/student/login");
      return;
    }

    setAuthorized(true);
  }, [router]);

  // 🧠 Restore saved form data
  useEffect(() => {
    if (!authorized) return;

    const saved = sessionStorage.getItem("complaintData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTitle(parsed.title || "");
      setDepartment(parsed.department || "");
      setDescription(parsed.description || "");
    }
  }, [authorized]);

  if (!authorized) return null; // ⛔ Prevent flash

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem(
        "uploadedFile",
        JSON.stringify({
          name: selectedFile.name,
          type: selectedFile.type,
          data: reader.result,
        })
      );
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    sessionStorage.setItem(
      "complaintData",
      JSON.stringify({
        title,
        department,
        description,
        fileName: file ? file.name : null,
      })
    );

    router.push("/student/complaints/review");
  };

  return (
    <main
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        px-4
      "
    >
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
          Submit a New Complaint
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Complaint title"
            className="w-full rounded-xl border px-4 py-3"
          />

          <select
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          >
            <option value="" disabled>Select department</option>
            <option value="student_affairs">Student Affairs</option>
            <option value="academics">Academics</option>
          </select>

          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your complaint..."
            className="w-full rounded-xl border px-4 py-3"
          />

          <input type="file" onChange={handleFileChange} />

          <button
            type="submit"
            className="
              w-full rounded-xl
              bg-gradient-to-r from-sky-500 to-indigo-500
              py-3 font-semibold text-white
              hover:scale-[1.02]
            "
          >
            Proceed to Review
          </button>
        </form>
      </section>
    </main>
  );
}
