export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-category">{product.category}</div>
      <h2 className="product-name">{product.name}</h2>
      <p className="product-price">Rs. {product.price.toLocaleString()}</p>
      <p className="product-date">
        Added on {new Date(product.createdAt).toLocaleString()}
      </p>
    </article>
  );
}
