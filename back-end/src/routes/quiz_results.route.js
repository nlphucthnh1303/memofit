const express = require("express");
const router = express.Router();

const {
  getQuizResults,
  getQuizResult,
  createQuizResult,
  updateQuizResult,
  deleteQuizResult,
} = require("../controllers/quiz_results.controller");

router.route("/").get(getQuizResults).post(createQuizResult);
router
  .route("/:id")
  .get(getQuizResult)
  .put(updateQuizResult)
  .delete(deleteQuizResult);

module.exports = router;
