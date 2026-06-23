import { useEffect, useRef, useState } from "react";
import CategoryFilter from "../components/CategoryFilter.jsx";
import ProductsList from "../components/ProductsList.jsx";
import { fetchProducts } from "../services/productsApi.js";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const latestCategoryRef = useRef("All");
  const latestFirstPageRequestRef = useRef(0);

  async function loadFirstPage(category) {
    const requestId = latestFirstPageRequestRef.current + 1;
    latestFirstPageRequestRef.current = requestId;
    setIsInitialLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchProducts({ category });

      if (latestFirstPageRequestRef.current !== requestId) {
        return;
      }

      setProducts(data.products);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error) {
      if (latestFirstPageRequestRef.current !== requestId) {
        return;
      }

      setErrorMessage(error.message);
      setProducts([]);
      setNextCursor(null);
      setHasMore(false);
    } finally {
      setIsInitialLoading(false);
    }
  }

  async function handleLoadMore() {
    if (!nextCursor || isLoadingMore) {
      return;
    }

    const requestCategory = selectedCategory;
    setIsLoadingMore(true);
    setErrorMessage("");

    try {
      const data = await fetchProducts({
        category: requestCategory,
        cursor: nextCursor
      });

      if (latestCategoryRef.current !== requestCategory) {
        return;
      }

      setProducts((currentProducts) => [...currentProducts, ...data.products]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoadingMore(false);
    }
  }

  useEffect(() => {
    latestCategoryRef.current = selectedCategory;
    loadFirstPage(selectedCategory);
  }, [selectedCategory]);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Internship Submission</p>
        <h1 className="title">Product Browser with Stable Cursor Pagination</h1>
        <p className="subtitle">
          Newest products appear first. Filtering and pagination stay correct even
          when new products are inserted.
        </p>
      </section>

      <section className="toolbar">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </section>

      {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

      {isInitialLoading ? (
        <div className="status-card">Loading products...</div>
      ) : (
        <>
          <ProductsList products={products} />

          <div className="footer-actions">
            {hasMore ? (
              <button
                type="button"
                className="load-more-button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Loading more..." : "Load More"}
              </button>
            ) : (
              <div className="status-card">No more products to load.</div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
