const express = require("express");

const connectDB = require("./connection");
const urlRoutes = require("./routes/url");
const app = express();

const PORT = 3000;

connectDB("mongodb://127.0.0.1:27017/url-shortner")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error", err));

// middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/url", urlRoutes);

app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT}`);
});
