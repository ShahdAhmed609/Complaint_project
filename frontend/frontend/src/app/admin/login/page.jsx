"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/auth/admin/login",
        {
          email: username,
          password: password,
        }
      );

      if (res.data && res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminRole", "admin");
        router.push("/admin");
      } else {
        setError("Invalid login response from server.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid admin credentials. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <section className="w-full max-w-md bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 animate-float">
        <h1 className="text-center text-3xl font-extrabold text-slate-800 dark:text-white mb-6">
          Admin Login
        </h1>

        {error && (
          <p className="mb-4 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-3 font-semibold text-white shadow-lg"
          >
            Login
          </button>
        </form>
      </section>
    </main>
  );
}
