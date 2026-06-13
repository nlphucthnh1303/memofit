const express = require("express");
const router = express.Router();

const {
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
} = require("../controllers/exams.controller");

router.route("/").get(getExams).post(createExam);
router.route("/:id").get(getExam).put(updateExam).delete(deleteExam);

module.exports = router;
