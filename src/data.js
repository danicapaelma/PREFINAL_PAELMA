import headphones from "./images/headphone.jpg";
import mug from "./images/mug.jpg";
import shoes from "./images/shoes.jpg";
import watch from "./images/smartwatch.jpg";


const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    image: headphones,
    price: 6999.0,
    quantity: 8,
    rating: 4.5,
    description: "Stylish pink wireless headphones with noise cancellation.",
    specification: "Bluetooth 5.0 • 20h battery • Soft ear cushions",
  },
  {
    id: 2,
    name: "Rose Gold Mug",
    category: "Home",
    image: mug,
    price: 499.0,
    quantity: 15,
    rating: 4.3,
    description: "Beautiful rose gold ceramic mug, perfect for coffee or tea.",
    specification: "350ml • Dishwasher safe",
  },
  {
    id: 3,
    name: "Pink Running Shoes",
    category: "Sportswear",
    image: shoes,
    price: 11995.0,
    quantity: 10,
    rating: 4.7,
    description: "Lightweight running shoes with pink accent design.",
    specification: "Breathable mesh • Rubber sole • Cushioned fit",
  },
  {
    id: 4,
    name: "Smartwatch",
    category: "Electronics",
    image: watch,
    price: 26490.0,
    quantity: 5,
    rating: 4.9,
    description: "Chic pink smartwatch with heart rate, steps & sleep tracking.",
    specification: "AMOLED display • Waterproof • Bluetooth 5.2",
  },
];

export default DEFAULT_PRODUCTS;
