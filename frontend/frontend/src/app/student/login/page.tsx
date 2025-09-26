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
        localStorage.clear();
        localStorage.setItem('authToken', token);
        localStorage.setItem('role', role);

        alert('Login Successful!');
        role === "student" ? router.push('/student/dashboard') : router.push('/admin/dashboard');
      } else {
        setError('Login successful, but no token was provided.');
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.code === "ERR_NETWORK") {
        setError('Network Error: Backend is not running. Using mock login for now.');
        if (email === 'user@test.com' && password === 'password123') {
          localStorage.clear();
          localStorage.setItem('authToken', 'fake-token-for-testing');
          localStorage.setItem('role', 'student');
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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-slate-800">Welcome Back!</h1>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center text-sm">
            Don't have an account?
            <Link href="/student/register" className="font-medium text-indigo-600 ml-1">
              Register Now
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
