// src/app/student/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful! Please login.");
      router.push("/student/login");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <main
      className="
        min-h-screen w-full
        flex items-center justify-center
        bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        px-4
      "
    >
      {/* Floating glass card */}
      <section
        className="
          w-full max-w-md
          bg-white/70 dark:bg-slate-800/80
          backdrop-blur-lg
          rounded-3xl
          shadow-xl dark:shadow-2xl
          p-8
          animate-float
        "
      >
        <h1
          className="
            mb-8 text-center font-extrabold tracking-tight
            text-gray-800 dark:text-slate-100
            text-[clamp(1.8rem,3vw,2.2rem)]
          "
        >
          Create Your Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-5">
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="
              w-full rounded-xl py-3 font-semibold text-white
              bg-gradient-to-r from-sky-500 to-indigo-500
              hover:from-sky-600 hover:to-indigo-600
              transition-all duration-300
              shadow-lg hover:shadow-xl
            "
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?
            <Link
              href="/student/login"
              className="ml-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

/* Reusable styled input */
function Input({ type = "text", ...props }: any) {
  return (
    <input
      type={type}
      required
      className="
        w-full rounded-xl px-4 py-3
        bg-white/80 dark:bg-slate-700
        border border-gray-300 dark:border-slate-600
        text-gray-800 dark:text-slate-100
        placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-sky-400
        transition
      "
      {...props}
    />
  );
}
