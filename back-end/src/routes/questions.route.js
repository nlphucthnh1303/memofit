const express = require("express");
const router = express.Router();

const {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questions.controller");

router.route("/").get(getQuestions).post(createQuestion);
router
  .route("/:id")
  .get(getQuestion)
  .put(updateQuestion)
  .delete(deleteQuestion);

module.exports = router;
