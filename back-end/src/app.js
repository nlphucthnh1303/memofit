const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Simple test route
app.get("/", (req, res) => {
  res.send("Hello from Express backend!");
});

app.use("/api/users", require("./routes/users.route"));
app.use("/api/collections", require("./routes/collections.route"));
app.use("/api/vocabularies", require("./routes/vocabularies.route"));
app.use((err, req, res, next) => {
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
