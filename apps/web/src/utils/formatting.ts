import { log } from "@repo/logger";

export const formatDate = (date: string) => {
  if (!date) return "Invalid Date";

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return "Invalid Date";
    }
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  } catch (e) {
    log("Date formatting error:", e);
    return "Invalid Date";
  }
};

export const formatPrice = (price: string) => {
  if (!price) return "$0.00";

  try {
    const num = parseFloat(price);
    if (isNaN(num)) return "$0.00";

    const parts = num.toFixed(2).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return `$${parts.join(".")}`;
  } catch (e) {
    return "$0.00";
  }
};

export const formatStock = (stock: string) => {
  const stockNum = parseInt(stock);

  if (isNaN(stockNum)) {
    return "Out of Stock";
  }

  if (stockNum === 0) {
    return "Out of Stock";
  } else if (stockNum < 5) {
    return `Low Stock (${stockNum} left)`;
  } else if (stockNum < 10) {
    return `Limited Stock (${stockNum} available)`;
  }
  return `In Stock (${stockNum})`;
};

export const formatUserName = (firstname: string, lastname: string) => {
  if (!firstname && !lastname) return "Unknown User";

  const first = (firstname || "").trim();
  const last = (lastname || "").trim();

  if (first && last) {
    return `${first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`;
  } else if (first) {
    return first.charAt(0).toUpperCase() + first.slice(1);
  } else if (last) {
    return last.charAt(0).toUpperCase() + last.slice(1);
  }

  return "Unknown User";
};

export const formatSearchTerm = (term: string) => {
  if (!term) return "";

  return term
    .toLowerCase()
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
