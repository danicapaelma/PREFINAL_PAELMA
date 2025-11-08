import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetail({ products }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product)
    return (
      <div className="detail not-found">
        <p>Product not found.</p>
        <button className="back-link" onClick={() => navigate("/catalog")}>
          ← Back to Catalog
        </button>
      </div>
    );

  return (
    <div className="detail">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <p>Rating: ⭐ {product.rating}</p>
      <p className="price">₱ {product.price.toFixed(2)}</p>
      <button className="back-link" onClick={() => navigate("/catalog")}>
        ← Back to Catalog
      </button>
    </div>
  );
}
