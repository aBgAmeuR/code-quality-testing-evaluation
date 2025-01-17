"use client";

import { useEffect, useMemo, useState } from "react";

import { log } from "@repo/logger";
import { Button } from "@repo/ui/button";
import { Link } from "@repo/ui/link";
import { useRouter } from "next/navigation";

import { getProducts } from "~/services/api";
import { Product } from "~/types";
import { isAuthenticated } from "~/utils/auth";

interface ExtendProduct extends Product {
  searchableText: string;
  priceCategory: string;
  stockStatus: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<ExtendProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        const processedData: ExtendProduct[] = data.map((item: any) => ({
          ...item,
          searchableText: `${item.name.toLowerCase()} ${item.price} ${item.stock}`,
          priceCategory:
            item.price < 50
              ? "cheap"
              : item.price < 100
                ? "medium"
                : "expensive",
          stockStatus:
            item.stock === 0 ? "out" : item.stock < 10 ? "low" : "available"
        }));
        setProducts(processedData);
      } catch (err) {
        setError("Failed to load products");
        log(err);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const searchFiltered = products.filter((product) => {
      if (!searchTerm) return true;

      return (
        product.searchableText.includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.price.toString().includes(searchTerm) ||
        product.stock.toString().includes(searchTerm)
      );
    });

    const priceFiltered = searchFiltered.filter((product) => {
      if (!priceFilter) return true;

      const price = parseFloat(product.price.toString());
      switch (priceFilter) {
        case "low":
          return price < 50 && product.priceCategory === "cheap";
        case "medium":
          return (
            price >= 50 && price < 100 && product.priceCategory === "medium"
          );
        case "high":
          return price >= 100 && product.priceCategory === "expensive";
        default:
          return true;
      }
    });

    return priceFiltered.filter((product) => {
      if (!stockFilter) return true;

      const stockNum = parseInt(product.stock.toString());

      switch (stockFilter) {
        case "out":
          return stockNum === 0 && product.stockStatus === "out";
        case "low":
          return stockNum > 0 && stockNum < 10 && product.stockStatus === "low";
        case "available":
          return stockNum >= 10 && product.stockStatus === "available";
        default:
          return true;
      }
    });
  }, [products, searchTerm, priceFilter, stockFilter]);

  if (!isAuthenticated()) return router.push("/login");

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h2>Products</h2>
        <Link href="/add-product">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded border border-gray-300 flex-1"
          data-testid="search-input"
        />

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="p-2 rounded border border-gray-300"
          data-testid="price-filter"
        >
          <option value="">All Prices</option>
          <option value="low">Low (&lt; $50)</option>
          <option value="medium">Medium ($50 - $100)</option>
          <option value="high">High (&gt; $100)</option>
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="p-2 rounded border border-gray-300"
          data-testid="stock-filter"
        >
          <option value="">All Stock</option>
          <option value="out">Out of Stock</option>
          <option value="low">Low Stock</option>
          <option value="available">Available</option>
        </select>
      </div>

      {error ? (
        <div className="text-red-600 p-3 bg-red-100 mb-5 rounded">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border border-gray-300 rounded-lg p-4 bg-white"
            data-testid={`product-${product.id}`}
          >
            <h3 className="mb-2">{product.name}</h3>
            <p className="mb-1 text-gray-600">Price: ${product.price}</p>
            <p
              className={`mb-1 ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Stock: {product.stock}
            </p>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-600">
          No products found matching your criteria
        </p>
      )}
    </div>
  );
};

export default ProductList;
