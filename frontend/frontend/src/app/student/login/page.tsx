"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://127.0.0.1:5000/api/auth/login', { email, password });
      const { token, role } = data;

      if (token) {
        localStorage.setItem('studentToken', token);
        localStorage.setItem('studentRole', role);

        alert('Login Successful!');
        router.push('/student/dashboard');
      } else {
        setError('Login successful, but no token was provided.');
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.code === "ERR_NETWORK") {
        setError('Network Error: Backend is not running. Using mock login for now.');
        if (email === 'user@test.com' && password === 'password123') {
          localStorage.setItem('studentToken', 'fake-token-for-testing');
          localStorage.setItem('studentRole', 'student');
          alert('Login Successful! (Test Mode)');
          router.push('/student/dashboard');
        } else {
          setError('Invalid credentials. (Test Mode)');
        }
      } else {
        setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

 return (
  <main
    className="
      min-h-screen w-full flex items-center justify-center
      bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
      px-4 sm:px-6 lg:px-8
    "
  >
    {/* Floating Card */}
    <section
      className="
        w-full max-w-md
        bg-white/70 dark:bg-slate-800/80
        backdrop-blur-md
        rounded-3xl
        shadow-xl dark:shadow-2xl
        p-6 sm:p-8 md:p-10
        animate-float
      "
    >
      {/* Heading */}
      <h1
        className="
          text-center font-extrabold tracking-tight mb-2
          text-gray-800 dark:text-slate-100
          text-[clamp(1.8rem,4vw,2.5rem)]
        "
      >
        Welcome Back
      </h1>

      <p className="text-center text-gray-600 dark:text-slate-300 mb-8">
        Sign in to continue to your dashboard
      </p>

      <form className="space-y-6" onSubmit={handleLogin}>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-slate-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="
              w-full rounded-xl px-4 py-3
              bg-white dark:bg-slate-700
              border border-gray-200 dark:border-slate-600
              text-gray-800 dark:text-slate-100
              placeholder-gray-400 dark:placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-slate-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="
              w-full rounded-xl px-4 py-3
              bg-white dark:bg-slate-700
              border border-gray-200 dark:border-slate-600
              text-gray-800 dark:text-slate-100
              placeholder-gray-400 dark:placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full rounded-xl px-4 py-3 font-semibold text-white
            bg-gradient-to-r from-blue-500 to-sky-400
            hover:from-blue-600 hover:to-sky-500
            shadow-lg hover:shadow-xl
            transition-all duration-300
            disabled:opacity-50
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register */}
        <p className="text-center text-sm text-gray-600 dark:text-slate-300">
          Don&apos;t have an account?
          <Link
            href="/student/register"
            className="ml-1 font-medium text-blue-600 dark:text-sky-400 hover:underline"
          >
            Register Now
          </Link>
        </p>
      </form>
    </section>
  </main>
);


}
