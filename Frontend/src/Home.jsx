import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import "./Home.css"; // Import the CSS file

const Home = () => {
  const [file, setFile] = useState(null); // Store the uploaded file
  const [scanResult, setScanResult] = useState(""); // Store the malware check result

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]); // Only allow one file
      setScanResult(""); // Reset scan result when a new file is uploaded
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/x-msdownload": [".exe"], // Some browsers may block `.exe`
    },
  });

  // Simulate malware scanning (Replace with actual API call later)
  const checkForMalware = () => {
    if (file) {
      // Simulating a random scan result
      const isMalicious = Math.random() < 0.3; // 30% chance of being malicious
      setScanResult(isMalicious ? "⚠️ Malicious file detected!" : "✅ File is clean.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Malware Scanner</h1>
      <p className="subtitle">Upload a file to check for malicious content.</p>

      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} />
        <UploadCloud className="icon" />
        {file ? <p>{file.name}</p> : <p>Drag & drop a file here, or click to select one</p>}
      </div>

      {/* Check Malware Button */}
      <button className="scan-button" onClick={checkForMalware} disabled={!file}>
        Check for Malware
      </button>

      {/* Result Tile */}
      {scanResult && <div className={`result-tile ${scanResult.includes("⚠️") ? "malicious" : "clean"}`}>{scanResult}</div>}
    </div>
  );
};

export default Home;