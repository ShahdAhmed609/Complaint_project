// // src/app/page.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Student Complaints Platform</h1>
      <p className="text-gray-600 mb-8 max-w-md text-center">
        Welcome! Please choose how you want to log in.
        <br />
        Students can submit complaints and suggestions,
        while administrators can review and respond.
      </p>

      <div className="flex gap-4">
        {/* Student Login */}
        <Link
          href="/student/login"
          className="px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          Login as Student
        </Link>

        {/* Admin Login */}
        <Link
          href="/admin/login"
          className="px-6 py-3 rounded-md bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
        >
          Login as Admin
        </Link>
      </div>
    </div>
  );
}
