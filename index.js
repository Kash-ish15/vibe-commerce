const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const User = require("./model/user.js");
const app = express();

app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(distPath));

const uri = "mongodb+srv://wadhwakashish13_db_user:uyNc5dsG7LxvrbbS5@cluster0.1jeunpw.mongodb.net/?appName=Cluster0";
mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

async function createUser() {
  const newUser = new User({
    name: 'Kashish',
    email: 'kashish@example.com'
  });

  await newUser.save(); // This line actually inserts data
  console.log('User saved successfully');
}

// createUser();

const products = require(path.join(__dirname, 'data', 'products.json'));
const cart = [];

app.get('/api/products', (req, res) => {
  res.json({ products });
});

app.get('/products', (req, res) => {
  res.redirect('/');
});

app.get('/api/cart', (req, res) => {
  const subtotal = cart.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
  res.json({
    cart,
    subtotal,
  });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'productId is required' });
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ message: 'quantity must be a positive number' });
  }

  const product = products.find((item) => item.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existingItem = cart.find((item) => item.product.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  const subtotal = cart.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);

  return res.status(201).json({
    message: 'Product added to cart',
    cart,
    subtotal
  });
});

app.delete('/api/cart/:productId', (req, res) => {
  const { productId } = req.params;

  const index = cart.findIndex((item) => item.product.id === productId);

  if (index === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  cart.splice(index, 1);

  const subtotal = cart.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);

  return res.status(200).json({
    message: 'Item removed from cart',
    cart,
    subtotal
  });
});

app.post('/api/cart/checkout', (req, res) => {
  if (cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const subtotal = cart.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
  const totalItems = cart.reduce((sum, entry) => sum + entry.quantity, 0);
  const receiptNumber = `VC-${Date.now()}`;
  const timestamp = new Date().toISOString();

  const receipt = {
    receiptNumber,
    timestamp,
    totalItems,
    subtotal,
    total: subtotal,
    items: cart.map(({ product, quantity }) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      lineTotal: Number((product.price * quantity).toFixed(2))
    }))
  };

  cart.length = 0;

  return res.status(200).json({
    message: 'Checkout complete',
    receipt
  });
});

app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) {
    return next();
  }

  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(3000, () => {
  console.log("Server is listening on http://localhost:3000");
});