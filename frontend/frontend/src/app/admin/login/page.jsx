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
    e.preventDefault(); // prevent reload

    try {
      // ✅ Send login request to Flask backend
      const res = await axios.post("http://127.0.0.1:5000/api/auth/admin/login", {
        email: username,
        password: password,
      });

      // ✅ If login is successful, save token
      if (res.data && res.data.token) {
        localStorage.setItem("adminToken", res.data.token);

        // redirect to admin dashboard
        router.push("/admin");
      } else {
        setError("Invalid login response from server");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    }

    // if (username === "admin" && password === "1234") {
    //   router.push("/admin");
    // } else {
    //   alert("Invalid username or password");
    // }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-black">
          Admin Login
        </h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Username or Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border rounded text-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded text-black"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Login
        </button>
      </form>
    </div>
  );
}
