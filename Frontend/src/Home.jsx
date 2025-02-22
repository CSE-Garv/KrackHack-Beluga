import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import "./Home.css";

const Home = () => {
  const [file, setFile] = useState(null);
  const [scanResult, setScanResult] = useState("");
  const [uploadedFilename, setUploadedFilename] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadedFilename("");
      setScanResult("");
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
    if (!file) {
      setScanResult("❌ No file selected");
      return;
    }

    setIsLoading(true); // Start loading animation

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BACKEND_URL}/uploads`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setScanResult(data.message);
      setUploadedFilename(data.filename);
    } catch (error) {
      console.error("Error during file upload:", error);
      setScanResult(`❌ Error: ${error.message || error}`);
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  return (

    <>

      <Navbar />

      <div className="container">
        {/* Background Gradient Circles */}
        <div className="gradient-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
          <div className="circle circle-4"></div>
          <div className="circle circle-5"></div>
        </div>

      <h1 className="title">Malware Scanner</h1>
        <p className="subtitle">Upload a file to check for malicious content.</p>

        <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          <UploadCloud className="icon" />
          {file ? <p>{uploadedFilename || file.name}</p> : <p>Drag & drop a file here, or click to select one</p>}
        </div>

        <button className="scan-button" onClick={checkForMalware} disabled={!file || isLoading}>
          {isLoading ? <span className="loader"></span> : "Check for Malware"}
        </button>

        {scanResult && (
          <div className={`result-tile ${scanResult.includes("❌") ? "malicious" : "clean"}`}>
            {scanResult}
          </div>
        )}
      </div>

      <Footer />

    </>
  );
};

export default Home;
