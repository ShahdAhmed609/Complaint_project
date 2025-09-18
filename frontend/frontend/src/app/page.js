import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Student Complaints Platform
      </h1>

      <p className="text-gray-600 mb-8 text-center max-w-md">
        Welcome! Please choose how you want to log in. 
        Students can submit complaints and suggestions, 
        while administrators can review and respond.
      </p>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* زرار الطالب */}
        <Link
          href="/student/login"
          className="px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 text-center"
        >
          Login as Student
        </Link>

        {/* زرار الأدمن */}
        <Link
          href="/admin/login"
          className="px-6 py-3 rounded-md bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 text-center"
        >
          Login as Admin
        </Link>
      </div>
    </main>
  );
}
