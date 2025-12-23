"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const linkClass = (href) =>
    `block rounded-xl px-4 py-2 transition ${
      pathname === href
        ? "bg-indigo-600 text-white"
        : "text-slate-700 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-slate-700"
    }`;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl p-6">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-8">
          Admin Panel
        </h2>

        <nav className="space-y-3">
          <Link href="/admin" className={linkClass("/admin")}>
            Dashboard
          </Link>
          <Link
            href="/admin/complaints"
            className={linkClass("/admin/complaints")}
          >
            Complaints
          </Link>
          <Link
            href="/admin/suggestions"
            className={linkClass("/admin/suggestions")}
          >
            Suggestions
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 animate-float">
          {children}
        </div>
      </main>
    </div>
  );
}