const express = require("express");
const router = express.Router();

const {
  getVocabularies,
  getVocabulary,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
  getVocabulariesByCollectionId,
} = require("../controllers/vocabularies.controller");

router.route("/").get(getVocabularies).post(createVocabulary);
router
  .route("/:id")
  .get(getVocabulary)
  .put(updateVocabulary)
  .delete(deleteVocabulary);
router.route("/collection/:id").get(getVocabulariesByCollectionId);
module.exports = router;
