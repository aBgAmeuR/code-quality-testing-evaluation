"use client";

import React, { useState } from "react";

import { log } from "@repo/logger";
import { useRouter } from "next/navigation";

import { createProduct } from "~/services/api";
import { isAuthenticated } from "~/utils/auth";

const AddProduct = () => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !price || !stock) {
      setError("All fields are required!");
      return;
    }

    try {
      await createProduct({
        name,
        price: parseFloat(price),
        stock: parseInt(stock)
      });
      router.push("/products");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create product");
      log("Error creating product:", err);
    }
  };

  if (!isAuthenticated()) return router.push("/login");

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
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Add New Product
      </h2>

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
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd"
          }}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd"
          }}
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd"
          }}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => router.push("/products")}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
