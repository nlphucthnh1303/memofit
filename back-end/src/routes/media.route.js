const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const mediaController = require("../controllers/media.controller");

router.post("/upload", upload.single("image"), mediaController.handleUpload);

module.exports = router;
