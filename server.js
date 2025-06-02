const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "emails.json");

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

app.use(cors());           
app.use(bodyParser.json());   

function readEmailList() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading email file:", e);
    return [];
  }
}

function writeEmailList(arr) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing email file:", e);
  }
}

app.get("/api/all-signups", (req, res) => {
  const allEmails = readEmailList();
  res.json(allEmails);
});

app.post("/api/signup", (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Invalid or missing 'email' in request body." });
  }

  const allEmails = readEmailList();
  if (!allEmails.includes(email)) {
    allEmails.push(email);
    writeEmailList(allEmails);
  }

  res.json({ success: true, allEmails });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
