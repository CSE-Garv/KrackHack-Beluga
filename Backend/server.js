require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// CORS Configuration
app.use(cors({
  origin: "*",  // This should allow all origins; if not, try specifying your frontend's URL explicitly.
  methods: "GET, POST",
  allowedHeaders: "Content-Type, Authorization"
}));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use the original file name, but avoid conflicts by appending timestamp
    const fileExtension = path.extname(file.originalname);
    const timestamp = Date.now();
    const filename = `${timestamp}${fileExtension}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// File upload and scan route
app.post("/uploads", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Build the full absolute path to the uploaded file
  const filePath = path.join(uploadDir, req.file.filename);
  
  // Verify file existence
  if (!fs.existsSync(filePath)) {
    return res.status(500).json({ error: "Uploaded file not found" });
  }

  // Dynamically get the Python interpreter path and script location
  const pythonPath = process.env.PYTHON_PATH || "python"; // Default to "python" if not set
  const pythonScriptPath = path.join(__dirname, "malware_scan.py");

  // Run malware_scan.py using dynamic Python path and absolute paths
  exec(`"${pythonPath}" "${pythonScriptPath}" "${filePath}"`, (error, stdout, stderr) => {
    console.log("Raw stdout:", stdout);
    console.log("Raw stderr:", stderr);

    // If there's an error or stderr content
    if (error || stderr) {
      const errorMessage = stderr || error.message || "Unknown error during scan.";
      return res.status(500).json({ error: `Error running malware scan: ${errorMessage}` });
    }

    // Extract the last meaningful line of stdout (result of scan)
    const result = stdout.trim().split("\n").pop();

    // Check if result is empty and handle accordingly
    if (!result) {
      return res.status(500).json({ error: "Failed to get scan result." });
    }

    // Send the result as a response (either "Infected" or "Clean")
    res.json({
      message: result,
      filename: req.file.filename, // Send filename in the response
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
