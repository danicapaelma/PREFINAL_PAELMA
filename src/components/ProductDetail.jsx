import React from "react";
import { useParams, Link } from "react-router-dom";

export default function ProductDetail({ products, onIncrement, onDecrement }) {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  if (!product) return <div className="card">Product not found. <Link to="/">Back</Link></div>;

  return (
    <div className="card">
      <h2>{product.name}</h2>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: 300, height: 200, objectFit: "cover", borderRadius: 8 }}
      />
      <p className="small">
        Category: {product.category} — Rating: {product.rating}
      </p>
      <p>{product.description}</p>
      <p>
        <strong>Specification:</strong> {product.specification}
      </p>
      <p className="price">₱ {product.price.toFixed(2)}</p>
      <div className="controls">
        <button className="btn btn-ghost" onClick={() => onDecrement(product.id)}>
          -
        </button>
        <span className="small">{product.quantity}</span>
        <button className="btn btn-ghost" onClick={() => onIncrement(product.id)}>
          +
        </button>
      </div>
      <div style={{ marginTop: 12 }}>
        <Link to="/" className="btn btn-ghost">
          Back to list
        </Link>
      </div>
    </div>
  );
}
