const express = require("express");
const router = express.Router();

const {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} = require("../controllers/collections.controller");

router.route("/").get(getCollections).post(createCollection);
router
  .route("/:id")
  .get(getCollection)
  .put(updateCollection)
  .delete(deleteCollection);

module.exports = router;
