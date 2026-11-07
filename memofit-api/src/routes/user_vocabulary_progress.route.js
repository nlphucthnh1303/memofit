const express = require("express");
const router = express.Router();

const {
  getUserVocabularyProgress,
  createUserVocabularyProgress,
  updateUserVocabularyProgress,
  deleteUserVocabularyProgress,
} = require("../controllers/user_vocabulary_progress.controller");

router.route("/").post(createUserVocabularyProgress);

router
  .route("/:id")
  .get(getUserVocabularyProgress)
  .put(updateUserVocabularyProgress)
  .delete(deleteUserVocabularyProgress);

module.exports = router;
