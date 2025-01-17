"use client";

import React, { useState } from "react";

import { Link } from "@repo/ui/link";
import { useRouter } from "next/navigation";

import { loginUser } from "~/services/api";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      router.push("/products");
    } catch (err: any) {
      setError(err.error || "An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto p-5 shadow-lg rounded-lg">
      <h2 className="text-center mb-5">Login</h2>
      {error ? (
        <div className="text-red-600 mb-3 p-3 bg-red-100 rounded">{error}</div>
      ) : null}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 rounded border border-gray-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded border border-gray-300"
        />
        <button
          type="submit"
          className="p-2 bg-green-600 text-white rounded cursor-pointer"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-5">
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
