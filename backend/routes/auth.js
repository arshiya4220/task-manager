const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const users = {}; // key=email, value={id,email,password}

// Register
router.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (users[email]) return res.status(400).json({ message: "User exists" });

  const id = Date.now().toString();
  users[email] = { id, email, password };

  const token = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users[email];
  if (!user || user.password !== password) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

module.exports = router;
