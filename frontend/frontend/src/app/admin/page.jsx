"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");

    if (!token || role !== "admin") {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <section>
      <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
        Welcome, Admin 👋
      </h1>

      <p className="text-slate-600 dark:text-slate-300 mb-10">
        Manage student complaints and suggestions efficiently from one place.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white/90 dark:bg-slate-900 p-6 shadow-md">
          <h3 className="text-xl font-bold mb-2">📩 Complaints</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Review, respond, and manage student complaints.
          </p>
        </div>

        <div className="rounded-2xl bg-white/90 dark:bg-slate-900 p-6 shadow-md">
          <h3 className="text-xl font-bold mb-2">💡 Suggestions</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            View and respond to student suggestions.
          </p>
        </div>
      </div>
    </section>
  );
}


