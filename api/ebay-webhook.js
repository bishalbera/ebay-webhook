const { createHash } = require("crypto"); // Import hashing library
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration values
// const verificationToken = process.env.VERIFICATION_TOKEN; // Your verification token
// const endpointURL = process.env.ENDPOINT_URL; // Your public Vercel endpoint

app.use(bodyParser.json());

// GET endpoint to handle the challenge code from eBay
app.get("/api/ebay-webhook", (req, res) => {
  const challengeCode = req.query.challenge_code;
  const verificationToken = process.env.VERIFICATION_TOKEN;
  const endpoint = process.env.ENDPOINT_URL;

  // Check if any variable is missing
  if (!challengeCode || !verificationToken || !endpoint) {
    console.error("Missing required parameters");
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const hash = createHash("sha256");
    hash.update(challengeCode);
    hash.update(verificationToken);
    hash.update(endpoint);

    const challengeResponse = hash.digest("hex");

    res.status(200).json({ challengeResponse });
  } catch (error) {
    console.error("Error generating hash:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST endpoint to handle notifications
app.post("/api/ebay-webhook", (req, res) => {
  if (req.headers["x-ebay-token"] !== verificationToken) {
    return res.status(403).send("Unauthorized");
  }

  console.log("Received eBay notification:", req.body);
  res.status(200).send("Notification received");
});

// Start the server (for local testing, Vercel handles this in production)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api/ebay-webhook`);
});

module.exports = app; // Export app for Vercel
