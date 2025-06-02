// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Path to a JSON file that will hold all sign‐up emails
const DATA_FILE = path.join(__dirname, "emails.json");

// Ensure the data file exists; if not, create it with an empty array
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

// Middleware
app.use(cors());               // allow cross‐origin (if you open frontend on a different port)
app.use(bodyParser.json());    // parse JSON request bodies

// Utility: read current array of emails from emails.json
function readEmailList() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading email file:", e);
    return [];
  }
}

// Utility: write updated array of emails back to emails.json
function writeEmailList(arr) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing email file:", e);
  }
}

/**
 * GET /api/all-signups
 * Returns JSON array of all stored emails.
 */
app.get("/api/all-signups", (req, res) => {
  const allEmails = readEmailList();
  res.json(allEmails);
});

/**
 * POST /api/signup
 * Expects JSON body: { email: "someone@example.com" }
 * Adds the email to the list (if not already present), then returns the full list.
 */
app.post("/api/signup", (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Invalid or missing 'email' in request body." });
  }

  // Read existing array, append if not already there
  const allEmails = readEmailList();
  if (!allEmails.includes(email)) {
    allEmails.push(email);
    writeEmailList(allEmails);
  }

  res.json({ success: true, allEmails });
});

// Serve frontend static files if you want (optional):
// app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
