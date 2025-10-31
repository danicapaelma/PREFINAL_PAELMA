import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onIncrement, onDecrement, onAddToCart }) {
  const subtotal = (product.price * product.quantity).toFixed(2);
  const lowStock = product.quantity < 5;

  return (
    <div className={`card product-card ${lowStock ? "low-stock" : ""}`}>
      <img src={product.image} alt={product.name} />
      <div className="product-meta">
        <h3>{product.name}</h3>
        <div className="small">
          Category: {product.category} — Rating: {product.rating}
        </div>
        <div className="price">₱ {product.price.toFixed(2)}</div>
        <div className="small">Quantity: {product.quantity}</div>
        <div className="small">Subtotal: ₱ {subtotal}</div>
        <div className="controls" style={{ marginTop: 8 }}>
          <button className="btn btn-ghost" onClick={() => onDecrement(product.id)}>
            -
          </button>
          <button className="btn btn-ghost" onClick={() => onIncrement(product.id)}>
            +
          </button>
          <button className="btn btn-primary" onClick={() => onAddToCart(product.id)}>
            Add to Cart
          </button>
          <Link to={`/product/${product.id}`} className="btn btn-ghost">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
