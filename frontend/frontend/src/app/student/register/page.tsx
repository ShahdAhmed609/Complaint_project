
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      await axios.post('http://127.0.0.1:5000/api/auth/register', {
        name: name,
        email: email,
        password: password,
      });
      alert('Registration successful! Please login.');
      router.push('/student/login');
    } catch (err: any) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

 return (
  <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-center text-3xl font-bold text-black">
        Create an Account
      </h1>

      <form onSubmit={handleRegister} className="mt-8 space-y-4 text-black">
        <div>
          <label htmlFor="name" className="font-medium text-black">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-400 p-2 shadow-sm text-black placeholder-gray-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="font-medium text-black">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-400 p-2 shadow-sm text-black placeholder-gray-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="font-medium text-black">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-400 p-2 shadow-sm text-black placeholder-gray-500"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="font-medium text-black">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-400 p-2 shadow-sm text-black placeholder-gray-500"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        <button
          type="submit"
          className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Register
        </button>

        <p className="text-center text-sm text-black">
          Already have an account?
          <Link
            href="/student/login"
            className="font-medium text-indigo-600 ml-1"
          >
            Login Now
          </Link>
        </p>
      </form>
    </div>
  </main>
);
}