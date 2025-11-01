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
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🧮 Compute overall total for both overview and cart
  const overallTotal = useMemo(
    () => cart.reduce((sum, p) => sum + p.price * p.quantity, 0),
    [cart]
  );

  // ➕ Add new product handler
  function handleAddProduct(newProduct) {
    setProducts((prev) => [newProduct, ...prev]);
    setIsAddOpen(false);
  }

  // 🔁 Update product quantity
  function updateQuantity(id, delta) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p
      )
    );
  }

  // 🛒 Add to cart handler
  function handleAddToCart(id) {
    const product = products.find((p) => p.id === id);
    if (!product || product.quantity <= 0) {
      alert("Out of stock!");
      return;
    }

    updateQuantity(id, -1);

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  }

  // 🩷 Filter logic
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
            {/* 🛒 Cart always visible */}
            <button className="btn-ghost" onClick={() => setIsCartOpen(true)}>
              🛒 Cart
            </button>

            {/* ➕ Add Product */}
            <button className="btn-primary" onClick={() => setIsAddOpen(true)}>
              ➕ Add Product
            </button>
          </div>
        </div>

        {/* ROUTES */}
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

                    {/* OVERALL TOTAL */}
                    <tfoot>
                      <tr className="total-row">
                        <td colSpan="3" style={{ textAlign: "right" }}>
                          Overall Total:
                        </td>
                        <td style={{ fontWeight: "bold" }}>
                          ₱{" "}
                          {products
                            .reduce((sum, p) => sum + p.price * p.quantity, 0)
                            .toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* AVAILABLE PRODUCTS */}
                <div className="card section">
                  <div className="section-header">
                    <h2>Available Products</h2>
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

          {/* PRODUCT DETAIL */}
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

        {/* 🛒 CART MODAL */}
        <Modal
          isOpen={isCartOpen}
          onRequestClose={() => setIsCartOpen(false)}
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>₱ {(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td colSpan="2" style={{ textAlign: "right" }}>
                      Total:
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      ₱ {overallTotal.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </>
          )}
          <button className="btn-ghost" onClick={() => setIsCartOpen(false)}>
            Close
          </button>
        </Modal>
      </div>
    </BrowserRouter>
  );
}
