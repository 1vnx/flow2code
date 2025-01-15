require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Route to handle flowchart image upload
app.post("/upload", upload.single("flowchart"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Mock AI API call (replace with actual implementation later)
    const aiResponse = await axios.post(
      "https://api.openai.com/v1/your-endpoint", // Replace with the actual AI API URL
      {
        prompt: `Generate code based on this flowchart image.`,
        language: req.body.language, // e.g., Python, JavaScript
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
      }
    );

    // Send the response back to the frontend
    res.json({
      message: "Code generated successfully!",
      code: aiResponse.data.code,
    });

    // Clean up the uploaded file
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process the request." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
