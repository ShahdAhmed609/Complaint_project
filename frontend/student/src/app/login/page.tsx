// src/app/login/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios'; // استيراد axios

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      // الكود ده للربط مع الـ Backend الحقيقي
      const response = await axios.post('http://127.0.0.1:5000/api/auth/login', {
        email: email,
        password: password,
      });
      const token = response.data.token;
      if (token) {
        localStorage.setItem('authToken', token);
        alert('Login Successful!');
        router.push('/complaints/new');
      } else {
        setError('Login successful, but no token was provided.');
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      // لو السيرفر مش شغال، استخدمي الكود الوهمي كبديل مؤقت
      if (err.code === "ERR_NETWORK") {
         setError('Network Error: Backend is not running. Using mock login for now.');
         // Mock Login Logic
         if (email === 'user@test.com' && password === 'password123') {
            localStorage.setItem('authToken', 'fake-token-for-testing');
            alert('Login Successful! (Test Mode)');
            router.push('/complaints/new');
         } else {
            setError('Invalid credentials. (Test Mode)');
         }
      } else {
        setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-slate-800">Welcome Back!</h1>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button type="submit" className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white">Login</button>
          <p className="text-center text-sm">
            Don't have an account?
            <Link href="/register" className="font-medium text-indigo-600 ml-1">Register Now</Link>
          </p>
        </form>
      </div>
    </main>
  );
}