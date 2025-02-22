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

  // Build the full absolute path to the uploaded file
  const filePath = path.join(uploadDir, req.file.filename);
  
  // Verify file existence
  if (!fs.existsSync(filePath)) {
    return res.status(500).json({ error: "Uploaded file not found" });
  }

  // Build the absolute path to the Python script
  const pythonScriptPath = path.join(__dirname, "malware_scan.py");

  // Run malware_scan.py using dynamic Python path and absolute paths
  exec(`"C:\\Python313\\python.exe" "${pythonScriptPath}" "${filePath}"`, (error, stdout, stderr) => {
  console.log("Raw stdout:", stdout);
  console.log("Raw stderr:", stderr);

  if (error && !stdout) {
  return res.status(500).json({ error: `Error running malware scan: ${stderr || error.message}` });
}

  // Extract only the last meaningful line
  const result = stdout.trim().split("\n").pop();
  
  res.json({ message: result });
});

});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
