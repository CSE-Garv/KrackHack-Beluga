require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// CORS Configuration
app.use(cors({
  origin: "*",
  methods: "GET, POST",
  allowedHeaders: "Content-Type, Authorization"
}));

// Allowed file extensions and size limit (10MB)
const ALLOWED_EXTENSIONS = [".exe", ".pdf", ".docx", ".doc"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}${fileExtension}`);
  },
});

// Multer file filter
const fileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
    return cb(new Error("Invalid file type. Only .exe, .pdf, and .docx are allowed."));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

// File upload and scan route
app.post("/uploads", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded or file type not allowed." });
  }

  const filePath = path.join(uploadDir, req.file.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(500).json({ error: "Uploaded file not found" });
  }

  const pythonPath = process.env.PYTHON_PATH || "python"; 
  const pythonScriptPath = path.join(__dirname, "malware_scan.py");

  console.log(`Running: ${pythonPath} ${pythonScriptPath} ${filePath}`);

  const pythonProcess = spawn(pythonPath, [pythonScriptPath, filePath]);

  let output = "";
  let errorOutput = "";

  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on("close", (code) => {
    console.log("Python stdout:", output);
    console.log("Python stderr:", errorOutput);

    if (code !== 0 || errorOutput.trim().length > 0) {
      return res.status(500).json({ error: "Error running malware scan", details: errorOutput, stdout: output });
    }

    try {
      const resultData = JSON.parse(output.trim()); // Parse JSON output from Python
      res.json(resultData);
    } catch (e) {
      return res.status(500).json({ error: "Failed to parse Python script output", details: output });
    }
  });
});

// Error handling for Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
