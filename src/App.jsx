import React, { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DEFAULT_PRODUCTS from "./data";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import AddProductForm from "./components/AddProductForm";
import "./App.css";
import "./styles.css";

export default function App() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [filter, setFilter] = useState("All");

  const overallTotal = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    [products]
  );

  function handleAddProduct(newProduct) {
    setProducts((prev) => [newProduct, ...prev]);
  }

  function updateQuantity(id, delta) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p
      )
    );
  }

  function handleAddToCart(id) {
    updateQuantity(id, -1);
    alert("Added to cart!");
  }

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filtered = products.filter((p) =>
    filter === "All" ? true : p.category === filter
  );

  return (
    <BrowserRouter>
      <div className="container">
        {/* HEADER */}
        <div className="header">
          <h1>Product Management App</h1>
          <div className="small">Overall Total: ₱ {overallTotal.toFixed(2)}</div>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div className="vertical-layout">
                {/* FILTER + TABLE */}
                <div className="card section">
                  <div className="section-header">
                    <h2>Product Overview</h2>
                    <div className="filter-row">
                      <label className="small">Filter by Category:</label>
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <Link to={`/product/${p.id}`}>{p.name}</Link>
                          </td>
                          <td>₱ {p.price.toFixed(2)}</td>
                          <td>{p.quantity}</td>
                          <td>₱ {(p.price * p.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* PRODUCT GRID */}
                <div className="card section">
                  <h2>Available Products</h2>
                  <ProductList
                    products={filtered}
                    onIncrement={(id) => updateQuantity(id, 1)}
                    onDecrement={(id) => updateQuantity(id, -1)}
                    onAddToCart={handleAddToCart}
                  />
                </div>

                {/* ADD PRODUCT + SUMMARY */}
                <div className="bottom-panels">
                  <div className="card add-product">
                    <AddProductForm onAdd={handleAddProduct} />
                  </div>

                  <div className="card summary">
                    <h3>Summary</h3>
                    <p className="small">Total Products: {products.length}</p>
                    <p className="small">
                      Overall Total: ₱ {overallTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProductDetail
                products={products}
                onIncrement={(id) => updateQuantity(id, 1)}
                onDecrement={(id) => updateQuantity(id, -1)}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
