const express = require("express");
const app = express();
app.use(express.json());

let orders = [
  { id: 1, item: "Book", quantity: 2 },
  { id: 2, item: "Laptop", quantity: 1 },
];

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.get("/orders/:id", (req, res) => {
  const order = orders.find((o) => o.id == req.params.id);
  order ? res.json(order) : res.status(404).send({ error: "Order not found" });
});

app.post("/orders", (req, res) => {
  const newOrder = { id: Date.now(), ...req.body };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.get("/health", (req, res) => {
  res.status(200);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Orders service running on port ${PORT}`));
