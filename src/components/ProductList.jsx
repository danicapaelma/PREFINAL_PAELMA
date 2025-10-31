import React from "react";
import ProductCard from "./ProductCard";

export default function ProductList({ products, onIncrement, onDecrement, onAddToCart }) {
  return (
    <div className="product-list">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
