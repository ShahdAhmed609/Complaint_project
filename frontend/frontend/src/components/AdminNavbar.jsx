"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  const linkClass = (href) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      pathname === href
        ? "bg-gray-100 text-blue-600"
        : "text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo + Nav */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-lg font-semibold text-blue-600">
            Admin Dashboard
          </Link>
          <nav className="hidden md:flex gap-2">
            <Link href="/admin" className={linkClass("/admin")}>
              Overview
            </Link>
            <Link href="/admin/complaints" className={linkClass("/admin/complaints")}>
              Complaints
            </Link>
            <Link href="/admin/users" className={linkClass("/admin/users")}>
              Users
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden md:inline-block px-3 py-2 rounded-md border text-sm">
            Profile
          </button>
          <button className="px-3 py-2 rounded-md bg-red-600 text-white text-sm">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
