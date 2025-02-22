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
  origin: "*",  // Allow all origins (change to frontend URL in production)
  methods: "GET, POST",
  allowedHeaders: "Content-Type, Authorization"
}));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const newFilename = `uploaded_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage });

// File upload and scan route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.join(uploadDir, req.file.filename);

  // Run malware_scan.py using dynamic Python path
  exec(`${process.env.PYTHON_PATH || "python3"} malware_scan.py "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running malware scan: ${stderr}`);
      return res.status(500).json({ error: "Error running malware scan" });
    }

    res.json({ 
      message: "Malware scan completed",
      result: stdout.trim(), 
      filename: req.file.filename 
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
