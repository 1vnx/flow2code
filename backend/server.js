const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json()); // To parse JSON bodies

// Dummy route to test the backend
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

const port = process.env.PORT || 5001; // Change to 5001 or another free port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
