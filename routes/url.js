const express = require("express");

const router = express.Router();

const { generateShortId, getRedirectUrl } = require("../controllers/url");

router.post("/", generateShortId);
router.get("/:shortId", getRedirectUrl);
// router.get("//analytics/:shortId/");

module.exports = router;
