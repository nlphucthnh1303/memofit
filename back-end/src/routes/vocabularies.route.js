const express = require("express");
const router = express.Router();

const {
  getVocabularies,
  getVocabulary,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
  getVocabulariesByCollectionId,
  getVocabulariesDetailByCollectionId,
  getVocabularyDetail,
  downloadImportTemplate,
  previewImportTemplate,
  confirmImportTemplate,
  getVocabulariesSearch,
} = require("../controllers/vocabularies.controller");
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
router.route("/").get(getVocabularies).post(createVocabulary);
router
  .route("/detail/collection/:collection_id/:user_id")
  .get(getVocabulariesDetailByCollectionId);
router.route("/detail/:vocabulary_id/:user_id").get(getVocabularyDetail);
router
  .route("/:id")
  .get(getVocabulary)
  .put(updateVocabulary)
  .delete(deleteVocabulary);
router.route("/collection/:id").get(getVocabulariesByCollectionId);
router.route("/search/:keyword/:limit").get(getVocabulariesSearch);
router.route("/import/template").get(downloadImportTemplate);
router
  .route("/import/preview")
  .post(upload.single("file"), previewImportTemplate);
router.route("/import/confirm").post(confirmImportTemplate);
module.exports = router;
