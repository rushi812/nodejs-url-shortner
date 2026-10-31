const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
  },
  redirectUrl: {
    type: String,
    required: true,
  },
  visitHistory: [{ timestamp: { type: Date, default: Date.now() } }],
  // from the history of the visits, we can store the timestamp of each visit, based on this we can calculate the number of visits in the last 24 hours, last 7 days, last 30 days, and last 90 days (basically total clicks)
});

const URLModel = mongoose.model("url", urlSchema);

module.exports = URLModel;
