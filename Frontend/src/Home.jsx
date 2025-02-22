import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import "./Home.css";

const Home = () => {
  const [file, setFile] = useState(null);
  const [scanResult, setScanResult] = useState("");
  const [uploadedFilename, setUploadedFilename] = useState(""); // Store uploaded filename

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadedFilename(""); // Reset filename on new file upload
      setScanResult(""); // Clear previous scan result
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/x-msdownload": [".exe"],
    },
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const checkForMalware = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setScanResult(data.message);
      setUploadedFilename(data.filename); // Store updated filename
    } 
    catch (error) {
    console.error("Upload Error:", error);
    setScanResult(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Malware Scanner</h1>
      <p className="subtitle">Upload a file to check for malicious content.</p>

      <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} />
        <UploadCloud className="icon" />
        {file ? <p>{uploadedFilename || file.name}</p> : <p>Drag & drop a file here, or click to select one</p>}
      </div>

      <button className="scan-button" onClick={checkForMalware} disabled={!file}>
        Check for Malware
      </button>

      {scanResult && <div className={`result-tile ${scanResult.includes("❌") ? "malicious" : "clean"}`}>{scanResult}</div>}
    </div>
  );
};

export default Home;
