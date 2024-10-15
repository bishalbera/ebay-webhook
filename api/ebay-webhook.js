// api/ebay-webhook.js

const express = require("express");
const bodyParser = require("body-parser");

// Initialize Express
const app = express();
app.use(bodyParser.json());

// Webhook endpoint to receive notifications
app.all("/api/ebay-webhook", (req, res) => {
  const verificationToken = process.env.VERIFICATION_TOKEN;

  if (req.method === "POST") {
    // Verify token sent by eBay
    if (req.headers["x-ebay-token"] !== verificationToken) {
      console.error("Invalid verification token");
      return res.status(403).send("Unauthorized");
    }

    console.log("Received eBay notification:", req.body);
    return res.status(200).send("Notification received");
  }

  // Handle GET request for eBay validation
  if (req.method === "GET") {
    console.log("Received GET request for validation");
    return res.status(200).send("Endpoint validated successfully");
  }

  // Default response for other HTTP methods
  res.status(405).send("Method Not Allowed");
});

// Export the function for Vercel to handle the request
module.exports = app;
