import React, { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Modal from "react-modal";
import DEFAULT_PRODUCTS from "./data";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import AddProductForm from "./components/AddProductForm";
import "./App.css";
import "./styles.css";

Modal.setAppElement("#root");

export default function App() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [filter, setFilter] = useState("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const overallTotal = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    [products]
  );

  function handleAddProduct(newProduct) {
    setProducts((prev) => [newProduct, ...prev]);
    setIsAddOpen(false);
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
          <div className="header-buttons">
            <button className="btn-ghost" onClick={() => setIsSummaryOpen(true)}>
              🛒 View Summary
            </button>
            <button className="btn-primary" onClick={() => setIsAddOpen(true)}>
              ➕ Add Product
            </button>
          </div>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <div className="vertical-layout">
                {/* PRODUCT OVERVIEW TABLE */}
                <div className="card section">
                  <div className="section-header">
                    <h2>Product Overview</h2>
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

                {/* PRODUCT GRID WITH FILTER */}
                <div className="card section">
                  <div className="section-header">
                    <h2>Available Products</h2>

                    {/* Filter Moved Here */}
                    <div className="filter-row">
                      <label className="small">Filter:</label>
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

                  <ProductList
                    products={filtered}
                    onIncrement={(id) => updateQuantity(id, 1)}
                    onDecrement={(id) => updateQuantity(id, -1)}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              </div>
            }
          />

          {/* PRODUCT DETAIL PAGE */}
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

        {/* ADD PRODUCT MODAL */}
        <Modal
          isOpen={isAddOpen}
          onRequestClose={() => setIsAddOpen(false)}
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Add New Product</h2>
          <AddProductForm onAdd={handleAddProduct} />
          <button className="btn-ghost" onClick={() => setIsAddOpen(false)}>
            Close
          </button>
        </Modal>

        {/* SUMMARY MODAL */}
        <Modal
          isOpen={isSummaryOpen}
          onRequestClose={() => setIsSummaryOpen(false)}
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Cart Summary</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>₱ {(p.price * p.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total: ₱ {overallTotal.toFixed(2)}</h3>
          <button className="btn-ghost" onClick={() => setIsSummaryOpen(false)}>
            Close
          </button>
        </Modal>
      </div>
    </BrowserRouter>
  );
}
