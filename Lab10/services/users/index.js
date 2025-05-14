const express = require("express");
const app = express();
app.use(express.json());

let users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id == req.params.id);
  user ? res.json(user) : res.status(404).send({ error: "User not found" });
});

app.get("/health", (req, res) => {
  res.status(200);
});

app.post("/users", (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Users service running on port ${PORT}`));
