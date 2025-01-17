"use client";

import React from "react";

import { Button } from "@repo/ui/button";
import { Link } from "@repo/ui/link";
import { useRouter } from "next/navigation";

import { logout } from "../services/api";
import { User } from "~/types";

const Navigation: React.FC = () => {
  const router = useRouter();
  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav
      style={{
        backgroundColor: "#333",
        padding: "10px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div>
        <Link
          href="/users"
          style={{
            color: "white",
            textDecoration: "none",
            marginRight: "20px"
          }}
        >
          Users
        </Link>
        <Link
          href="/products"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          Products
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <span
          style={{
            color: "white",
            marginRight: "20px"
          }}
        >
          Welcome, {user ? user.firstname : "User"}!
        </span>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
};

export default Navigation;
