const express = require("express");
const router = express.Router();

const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  generateAiQuestions,
  generateStaticQuestions,
} = require("../controllers/questions.controller");

router.route("/").get(getQuestions).post(createQuestion);
router
  .route("/:id")
  .get(getQuestion)
  .put(updateQuestion)
  .delete(deleteQuestion);
router.route("/generate-ai").post(generateAiQuestions);
router.route("/generate-static").post(generateStaticQuestions);
module.exports = router;
