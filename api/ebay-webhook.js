const { createHash } = require("crypto"); // Import hashing library
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration values
const verificationToken = process.env.VERIFICATION_TOKEN; // Your verification token
const endpointURL = process.env.ENDPOINT_URL; // Your public Vercel endpoint

app.use(bodyParser.json());

// GET endpoint to handle the challenge code from eBay
app.get("/api/ebay-webhook", (req, res) => {
  const challengeCode = req.query.challenge_code; // Extract the challenge code from query params

  if (!challengeCode) {
    return res.status(400).send({ error: "Missing challenge code" });
  }

  // Generate the response hash by concatenating the values in the correct order
  const hash = createHash("sha256");
  hash.update(challengeCode);
  hash.update(verificationToken);
  hash.update(endpointURL);

  const responseHash = hash.digest("hex"); // Get the final hashed value

  console.log("Challenge Response:", responseHash); // For debugging

  // Respond with the challenge response in JSON format
  res.setHeader("Content-Type", "application/json"); // Ensure correct header
  res.status(200).json({ challengeResponse: responseHash });
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
