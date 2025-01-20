const express = require("express");
const Url = require("../models/Url");
const preauthMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const {
  createShortUrl,
  redirectUrl,
  getAnalytics,
  getTopicAnalytics,
  getOverallAnalytics,
  recordAnalytics,
} = require("../controllers/urlController");

router.post("/short", preauthMiddleware, createShortUrl);
router.get("/:shortUrl", redirectUrl);
router.post("/analytics", recordAnalytics);
router.get("/analytics/overall", getOverallAnalytics);
router.get("/analytics/:alias", getAnalytics);
router.get("/analytics/topic/:topic", getTopicAnalytics);

module.exports = router;
