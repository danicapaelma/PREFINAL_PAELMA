import React from "react";
import { useParams, Link } from "react-router-dom";

export default function ProductDetail({ products, onIncrement, onDecrement }) {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="detail not-found">
        <h2>Product not found</h2>
        <Link to="/" className="back-link">← Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="detail">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>

      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Specification:</strong> {product.specification}</p>
      <p><strong>Price:</strong> ₱ {product.price.toFixed(2)}</p>
      <p><strong>Quantity:</strong> {product.quantity}</p>
      <p><strong>Rating:</strong> ⭐ {product.rating}</p>

      <div className="actions">
        <button onClick={() => onIncrement(product.id)}>+</button>
        <button onClick={() => onDecrement(product.id)}>-</button>
      </div>

      <Link to="/" className="back-link">← Back to Products</Link>
    </div>
  );
}
