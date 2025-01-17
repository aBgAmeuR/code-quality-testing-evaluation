"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

import { log } from "@repo/logger";
import { Link } from "@repo/ui/link";
import { useRouter } from "next/navigation";

import { registerUser } from "~/services/api";

interface FormData {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    firstname: "",
    lastname: ""
  });
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      router.push("/products");
    } catch (err: any) {
      log("Error registering user:", err);
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto p-5 shadow-lg rounded-lg">
      <h2 className="text-center mb-5">Register</h2>
      {error ? (
        <div className="text-red-600 mb-3 p-3 bg-red-100 rounded">{error}</div>
      ) : null}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          value={formData.firstname}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300"
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300"
        />
        <button
          type="submit"
          className="p-2 bg-green-600 text-white rounded cursor-pointer"
        >
          Register
        </button>
      </form>
      <p className="text-center mt-5">
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
