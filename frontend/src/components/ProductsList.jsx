import ProductCard from "./ProductCard.jsx";

export default function ProductsList({ products }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        No products found for the selected category.
      </div>
    );
  }

  return (
    <section className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
