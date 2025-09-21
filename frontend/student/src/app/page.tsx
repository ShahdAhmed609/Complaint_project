// src/app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-24 text-center">
      <h1 className="text-5xl font-bold text-cyan-400">Student Complaints and Suggestions</h1>
      <p className="mt-4 text-lg text-white max-w-2xl">Welcome to our official platform.</p>
      <div className="mt-8 flex gap-4">
        <div className="w-80 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-indigo-600">Login</h2>
          <Link href="/login" className="w-full">
            <button className="mt-4 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white">Login</button>
          </Link>
        </div>
        <div className="w-80 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-indigo-600">Register</h2>
          <Link href="/register" className="w-full">
            <button className="mt-4 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white">Register</button>
          </Link>
        </div>
      </div>
    </main>
  );
}