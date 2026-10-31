const { nanoid } = require("nanoid");

const URLModel = require("../models/url");

async function generateShortId(req, res) {
  const shortenedUrl = nanoid(8);
  const { redirectUrl } = req.body;

  if (!redirectUrl) {
    return res.status(400).json({ error: "redirectUrl is required" });
  }

  // Validate URL
  let parsedUrl;
  try {
    parsedUrl = new URL(redirectUrl);
    console.log("parsedUrl", parsedUrl);
  } catch (err) {
    return res.status(400).json({
      error: "Invalid URL Format",
    });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return res.status(400).json({
      error: "Only HTTP and HTTPS URLs are supported",
    });
  }

  await URLModel.create({
    shortId: shortenedUrl,
    redirectUrl,
    visitHistory: [],
  });

  res.status(201).json({ shortId: shortenedUrl, redirectUrl });
}

async function getAllUrls(req, res) {
  try {
    const allUrls = await URLModel.find({}).lean();
    return res.status(200).json({
      urls: allUrls,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getRedirectUrl(req, res) {
  try {
    const { shortId } = req.params;

    const urlData = await URLModel.findOne({ shortId });

    if (!urlData) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // On every get call, we are updating the visitHistory timestamp, so that we can get the total clicks/analytics data based on that
    urlData.visitHistory.push({ timestamp: Date.now() });

    await urlData.save();

    res.redirect(urlData.redirectUrl);
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

async function getUrlAnalytics(req, res) {
  try {
    const { shortId } = req.params;

    const urlData = await URLModel.findOne({ shortId });

    if (!urlData) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    const totalClick = urlData.visitHistory.length;

    return res.status(200).json({
      analytics: {
        shortId: urlData.shortId,
        redirectUrl: urlData.redirectUrl,
        visitHistory: urlData.visitHistory,
        totalVisits: totalClick,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

module.exports = {
  generateShortId,
  getRedirectUrl,
  getUrlAnalytics,
  getAllUrls,
};
