const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const axios = require("axios");

const app = express();
app.use(express.json());

const JWT_SECRET = fs.readFileSync("/run/secrets/jwt_secret", "utf8").trim();

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    const token = jwt.sign({ user: username }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

app.get("/orders", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const response = await axios.get("http://orders:3000/orders");
    res.json(response.data);
  } catch (err) {
    res.status(err.status).json({ error: err.response.data.error });
  }
});

app.get("/orders/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const id = req.params.id;
    const decoded = jwt.verify(token, JWT_SECRET);
    const response = await axios.get(`http://orders:3000/orders/${id}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.status).json({ error: err.response.data.error });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
