const express = require("express");
const router = express.Router();

const {
  getVocabularies,
  getVocabulary,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
} = require("../controllers/vocabularies.controller");

router.route("/").get(getVocabularies).post(createVocabulary);
router
  .route("/:id")
  .get(getVocabulary)
  .put(updateVocabulary)
  .delete(deleteVocabulary);

module.exports = router;
