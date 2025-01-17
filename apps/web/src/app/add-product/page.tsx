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
    <div className="max-w-md mx-auto p-5 shadow-lg rounded-lg">
      <h2 className="text-center mb-5">Add New Product</h2>

      {error ? (
        <div className="text-red-600 mb-3 p-3 bg-red-100 rounded">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded border border-gray-300"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 rounded border border-gray-300"
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="p-2 rounded border border-gray-300"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="flex-1 p-2 bg-red-600 text-white rounded cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 p-2 bg-green-600 text-white rounded cursor-pointer"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
