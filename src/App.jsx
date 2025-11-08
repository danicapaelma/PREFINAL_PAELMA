import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Modal from "react-modal";
import DEFAULT_PRODUCTS from "./data";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import AddProductForm from "./components/AddProductForm";
import homeBanner from "./images/home-banner.jpg"; // 🖼️ Your added image
import "./App.css";
import "./styles.css";

Modal.setAppElement("#root");

export default function App() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pendingQty, setPendingQty] = useState({});

  const overallTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  function handleAddProduct(newProduct) {
    setProducts((prev) => [newProduct, ...prev]);
    setIsAddOpen(false);
  }

  function adjustPendingQty(id, delta) {
    setPendingQty((prev) => {
      const current = prev[id] || 0;
      const newVal = Math.max(0, current + delta);
      return { ...prev, [id]: newVal };
    });
  }

  function handleAddToCart(id) {
    const qtyToAdd = pendingQty[id] || 0;
    if (qtyToAdd <= 0) return;

    const product = products.find((p) => p.id === id);
    if (!product || product.quantity < qtyToAdd) {
      alert("Not enough stock!");
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity - qtyToAdd } : p
      )
    );

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: qtyToAdd }];
      }
    });

    setPendingQty((prev) => ({ ...prev, [id]: 0 }));
  }

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filtered = products.filter((p) =>
    filter === "All" ? true : p.category === filter
  );

  return (
    <BrowserRouter>
      <div className="container">
        {/* 🌸 NAVBAR */}
        <nav className="navbar">
          <h1 className="logo">Eunoia LuxeMart</h1>
          <div className="nav-links">
            <Link to="/" className="nav-item">Home</Link>
            <Link to="/catalog" className="nav-item">Catalog</Link>
            <button className="btn-ghost" onClick={() => setIsCartOpen(true)}>
              🛒 Cart
            </button>
            <button className="btn-primary" onClick={() => setIsAddOpen(true)}>
              ➕ Add Product
            </button>
          </div>
        </nav>

        {/* ROUTES */}
        <Routes>
          {/* 🏠 HOME PAGE */}
          <Route
            path="/"
            element={
              <div className="home-page">
                <div className="home-content">
                  <div className="home-text">
                    <h2>Welcome to <span className="highlight">Eunoia LuxeMart</span></h2>
                    <p>
                      Experience elegance, organization, and effortless control.
                      Eunoia LuxeMart is your refined product management
                      solution, blending beauty and simplicity for modern
                      businesses. ✨
                    </p>
                    <Link to="/catalog" className="btn-primary">
                      Browse Catalog →
                    </Link>
                  </div>
                  <div className="home-image">
                    <img src={homeBanner} alt="Eunoia LuxeMart Banner" />
                  </div>
                </div>
              </div>
            }
          />

          {/* 🛍️ CATALOG PAGE */}
          <Route
            path="/catalog"
            element={
              <div className="vertical-layout">
                {/* 🌟 Featured Products Slider */}
                <div className="card section">
                  <div className="section-header">
                    <h2>Featured Products</h2>
                  </div>
                  <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={20}
                    slidesPerView={3}
                    loop={true}
                    autoplay={{ delay: 3000 }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                      320: { slidesPerView: 1 },
                      640: { slidesPerView: 2 },
                      900: { slidesPerView: 3 },
                    }}
                  >
                    {products.map((p) => (
                      <SwiperSlide key={p.id}>
                        <div className="slider-card">
                          <img src={p.image} alt={p.name} className="slider-image" />
                          <h3 className="slider-name">{p.name}</h3>
                          <p className="slider-rating">Rating: {p.rating}</p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* PRODUCT OVERVIEW */}
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
                        </tr>
                      ))}
                    </tbody>
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

                  <div className="product-list">
                    {filtered.map((p) => (
                      <div
                        key={p.id}
                        className={`product-card ${
                          p.quantity < 5 ? "low-stock" : ""
                        }`}
                      >
                        <img src={p.image} alt={p.name} />
                        <div className="product-meta">
                          <h3>{p.name}</h3>
                          <p className="small">
                            Category: {p.category} — Rating: {p.rating}
                          </p>
                          <p className="price">₱ {p.price.toFixed(2)}</p>
                          <p>Stock: {p.quantity}</p>
                        </div>

                        <div className="controls">
                          <button
                            className="btn-ghost"
                            onClick={() => adjustPendingQty(p.id, -1)}
                            disabled={(pendingQty[p.id] || 0) === 0}
                          >
                            -
                          </button>
                          <span>{pendingQty[p.id] || 0}</span>
                          <button
                            className="btn-ghost"
                            onClick={() => adjustPendingQty(p.id, 1)}
                            disabled={p.quantity <= (pendingQty[p.id] || 0)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="btn-primary"
                          onClick={() => handleAddToCart(p.id)}
                          disabled={(pendingQty[p.id] || 0) === 0}
                        >
                          Add to Cart
                        </button>
                        <button className="btn-ghost">
                          <Link to={`/product/${p.id}`}>Details</Link>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }
          />

          {/* PRODUCT DETAIL */}
          <Route
            path="/product/:id"
            element={<ProductDetail products={products} />}
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

        {/* CART MODAL */}
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
                      Overall Total:
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
