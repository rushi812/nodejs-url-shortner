const express = require("express");

const router = express.Router();

const {
  generateShortId,
  getRedirectUrl,
  getUrlAnalytics,
  getAllUrls,
} = require("../controllers/url");

router.route("/").post(generateShortId).get(getAllUrls);
router.get("/:shortId", getRedirectUrl);
router.get("/analytics/:shortId", getUrlAnalytics);

module.exports = router;
