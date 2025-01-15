require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5001; // Change to 5001 or another free port

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Route to handle flowchart image upload
app.post("/upload", upload.single("flowchart"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const language = req.body.language || "JavaScript"; // Default to JavaScript

    // AI API call to OpenAI
   const aiResponse = await axios.post(
     "https://api.openai.com/v1/chat/completions",
     {
       model: "gpt-4", // Change the model if needed
       messages: [
         {
           role: "system",
           content: `You are an expert at generating ${language} code from flowcharts.`,
         },
         {
           role: "user",
           content: `Generate ${language} code based on the provided flowchart.`,
         },
       ],
     },
     {
       headers: {
         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
         "Content-Type": "application/json",
       },
     }
   );


    // Send the AI-generated code back to the frontend
    res.json({
      message: "Code generated successfully!",
      code: aiResponse.data.choices[0].message.content,
    });

    // Clean up the uploaded file
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Error communicating with the AI API:", error.message);
    res.status(500).json({ error: "Failed to process the request." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

console.log(`API Key Loaded: ${process.env.OPENAI_API_KEY ? "Yes" : "No"}`);
