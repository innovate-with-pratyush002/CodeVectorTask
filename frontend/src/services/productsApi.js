const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Books",
  "Sports",
  "Home",
  "Food",
  "Beauty",
  "Toys"
];

export async function fetchProducts({ category = "All", cursor = null, limit = 20 }) {
  const searchParams = new URLSearchParams();
  searchParams.set("limit", String(limit));

  if (cursor) {
    searchParams.set("cursor", cursor);
  }

  if (category && category !== "All") {
    searchParams.set("category", category);
  }

  const response = await fetch(`${API_BASE_URL}/api/products?${searchParams.toString()}`);

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.message || "Failed to fetch products.");
  }

  return response.json();
}
