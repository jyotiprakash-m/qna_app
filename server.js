const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'static' directory (recommended)
app.use(express.static(path.join(__dirname, "static")));

// Fallback: always serve index.html for SPA routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Quiz app running on port ${PORT}`);
});
