const express = require("express");
const router = express.Router();

const {
  getQuizSessions,
  getQuizSession,
  createQuizSession,
  updateQuizSession,
  deleteQuizSession,
} = require("../controllers/quiz_sessions.controller");

router.route("/").get(getQuizSessions).post(createQuizSession);
router
  .route("/:id")
  .get(getQuizSession)
  .put(updateQuizSession)
  .delete(deleteQuizSession);

module.exports = router;
