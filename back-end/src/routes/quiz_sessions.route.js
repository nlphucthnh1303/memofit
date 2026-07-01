const express = require("express");
const router = express.Router();

const {
  getQuizSessions,
  getQuizSession,
  createQuizSession,
  updateQuizSession,
  deleteQuizSession,
  updateTimeEndQuizSession,
} = require("../controllers/quiz_sessions.controller");

router.route("/").get(getQuizSessions).post(createQuizSession);
router
  .route("/:id")
  .get(getQuizSession)
  .put(updateQuizSession)
  .delete(deleteQuizSession);
router.route("/time-end/:id").put(updateTimeEndQuizSession);

module.exports = router;
