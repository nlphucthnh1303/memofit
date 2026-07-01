const express = require("express");
const router = express.Router();
const {
  createMultipleQuestions,
  generateAiQuestions,
  generateStaticQuestions,
  getQuestions,
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getQuizBySessionIdAndExamId,
} = require("../controllers/questions.controller");

// --- 1. Specific Routes (Must be before parameterized routes) ---
router.post("/multiple", createMultipleQuestions);
router.post("/generate-ai", generateAiQuestions);
router.post("/generate-static", generateStaticQuestions);

// --- 2. Root Routes ---
router.route("/").get(getQuestions).post(createQuestion);

// --- 3. Parameterized Routes ---
router
  .route("/:id")
  .get(getQuestion)
  .put(updateQuestion)
  .delete(deleteQuestion);

// --- 4. Quiz Routes ---
router.get("/quiz/:exam_id/:session_id/:user_id", getQuizBySessionIdAndExamId);

module.exports = router;
