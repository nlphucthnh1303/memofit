const express = require("express");
const router = express.Router();

const {
  getExamQuestions,
  getExamQuestion,
  createExamQuestion,
  updateExamQuestion,
  deleteExamQuestion,
  createMultipleExamQuestions,
} = require("../controllers/exam_questions.controller");

router.route("/").get(getExamQuestions).post(createExamQuestion);
router
  .route("/:id")
  .get(getExamQuestion)
  .put(updateExamQuestion)
  .delete(deleteExamQuestion);

router.route("/multiple").post(createMultipleExamQuestions);

module.exports = router;
