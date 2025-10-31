import React, { useState } from "react";

export default function AddProductForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    image: "",
    category: "",
    description: "",
    specification: "",
    rating: "",
    price: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    const errs = {};
    for (const key in form) {
      if (!form[key]) errs[key] = "Required";
    }
    if (form.price && isNaN(Number(form.price))) errs.price = "Must be a number";
    if (form.quantity && (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0))
      errs.quantity = "Must be a non-negative integer";
    if (form.rating && (isNaN(Number(form.rating)) || Number(form.rating) < 0 || Number(form.rating) > 5))
      errs.rating = "Rating 0-5";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const newProduct = {
      id: Date.now(),
      ...form,
      price: Number(form.price),
      rating: Number(form.rating),
      quantity: Number(form.quantity),
    };
    onAdd(newProduct);
    setForm({
      name: "",
      image: "",
      category: "",
      description: "",
      specification: "",
      rating: "",
      price: "",
      quantity: "",
    });
    setErrors({});
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Add New Product</h3>
      {Object.keys(form).map((key) => (
        <div className="form-row" key={key}>
          <label>{key[0].toUpperCase() + key.slice(1)}</label>
          <input
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={`Enter ${key}`}
          />
          {errors[key] && <div className="small" style={{ color: "red" }}>{errors[key]}</div>}
        </div>
      ))}
      <button className="btn btn-primary" type="submit">
        Add Product
      </button>
    </form>
  );
}
