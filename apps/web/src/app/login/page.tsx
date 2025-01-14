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
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: "8px"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
      {error ? (
        <div
          style={{
            color: "red",
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "#ffebee",
            borderRadius: "4px"
          }}
        >
          {error}
        </div>
      ) : null}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd"
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>
      <p
        style={{
          textAlign: "center",
          marginTop: "20px"
        }}
      >
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
