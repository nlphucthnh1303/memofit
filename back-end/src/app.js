const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

// Import cấu hình & biến môi trường
require("dotenv").config(); // Đảm bảo đã nạp biến môi trường
const swaggerSpec = require("./config/swagger");
const PORT = process.env.PORT || 3000;

const app = express();

// --- 1. Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Hỗ trợ nhận dữ liệu từ form

// --- 2. Documentation ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- 3. Routes ---
app.get("/", (req, res) => res.send("Hello from Express backend!"));
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/users", require("./routes/users.route"));
app.use("/api/collections", require("./routes/collections.route"));
app.use("/api/vocabularies", require("./routes/vocabularies.route"));
app.use(
  "/api/user-vocabulary-progress",
  require("./routes/user_vocabulary_progress.route"),
);
app.use("/api/exams", require("./routes/exams.route"));
app.use("/api/exam-questions", require("./routes/exam_questions.route"));
app.use("/api/questions", require("./routes/questions.route"));
app.use("/api/quiz-sessions", require("./routes/quiz_sessions.route"));
app.use("/api/quiz-results", require("./routes/quiz_results.route"));

// --- 4. Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack); // Log lỗi ra console để debug
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// --- 5. Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
