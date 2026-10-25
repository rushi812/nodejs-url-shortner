const { nanoid } = require("nanoid");

const URLModel = require("../models/url");

async function generateShortId(req, res) {
  const shortenedUrl = nanoid(8);
  const { redirectUrl } = req.body;

  if (!redirectUrl) {
    return res.status(400).json({ error: "redirectUrl is required" });
  }

  await URLModel.create({
    shortId: shortenedUrl,
    redirectUrl,
    visitHistory: [],
  });

  res.status(201).json({ shortId: shortenedUrl });
}

// TODO: complete this getRedirectUrl controller
async function getRedirectUrl(req, res) {
  const { shortId } = req.params;

  const urlData = await URLModel.findOne({ shortId });

  if (!urlData) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  urlData.visitHistory.push({ timestamp: Date.now() });

  res.redirect(urlData.redirectUrl);
}

module.exports = { generateShortId, getRedirectUrl };
