import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react"; // Import UploadCloud icon
import { ChevronDown } from "lucide-react"; // Import the ChevronDown icon
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import "./Home.css";

const Home = () => {
  const [file, setFile] = useState(null);
  const [scanResult, setScanResult] = useState("");
  const [uploadedFilename, setUploadedFilename] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [riskScore, setRiskScore] = useState(null); // Added riskScore state
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Malware Scanner";

  // Typing Effect Logic
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index++;

      if (index > fullText.length) {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  // Cursor Blinking Effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];

      // Check file size (in bytes)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      if (selectedFile.size > MAX_FILE_SIZE) {
        setScanResult(["❌ Max size limit: 10 MB"]);
        setRiskScore(null); // Ensure risk score is reset
        return; // Stop further execution if the file size exceeds limit
      }

      setFile(selectedFile);
      setUploadedFilename("");
      setScanResult("");
      setRiskScore(null); // Reset riskScore when a new file is uploaded
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/x-msdownload": [".exe"],
      "application/msword": [".doc"],  // Added for .doc file support
    },
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const checkForMalware = async () => {
    if (!file) {
      setScanResult(["❌ No file selected"]);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BACKEND_URL}/uploads`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload file");
      }

      const data = await response.json();

      // Build a detailed result as an array of strings
      let resultArray = [`📜 Output: ${data.final_result || "No message from server."}`]; // Concatenate title and answer

      if (data.virustotal_hits !== null) {
        resultArray.push(`🛡 VirusTotal Hits: ${data.virustotal_hits}`);
      }

      if (data.pe_info) {
        resultArray.push(`💻 PE Info: ${JSON.stringify(data.pe_info, null, 2)}`);
      }

      if (data.pdf_info) {
        resultArray.push(`📄 PDF Info: ${JSON.stringify(data.pdf_info, null, 2)}`);
      }

      if (data.docx_info) {
        resultArray.push(`📝 DOCX Info: ${JSON.stringify(data.docx_info, null, 2)}`);
      }

      if (data.doc_info) { // Added for .doc file info
        resultArray.push(`📝 DOC Info: ${JSON.stringify(data.doc_info, null, 2)}`);
      }

      if (data.yara_matches && data.yara_matches.length > 0) {
        resultArray.push(`🔍 YARA Matches: ${data.yara_matches.join(", ")}`); // Join matches in one line
      }

      if (data.stdout) {
        resultArray.push(`✅ Stdout: ${data.stdout}`);
      }

      if (data.details) {
        resultArray.push(`⚠ Details: ${data.details}`);
      }

      if (data.errors) {
        resultArray.push(`❌ Errors: ${data.errors}`);
      }

      // Update state with the formatted result array
      setScanResult(resultArray);
      setUploadedFilename(data.filename || "Unknown filename");
      setRiskScore(data.risk_score !== undefined ? data.risk_score : "N/A");

    } catch (error) {
      console.error("Error during file upload:", error);
      setScanResult([`❌ Error: ${error.message || error}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetScan = () => {
    setFile(null);
    setScanResult("");
    setUploadedFilename("");
    setRiskScore(null);
  };

  // Detect scroll to toggle class
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        document.body.classList.add("scrolled");
      } else {
        document.body.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar />

      <div className="title-section">
        <h1 className="title">
          {typedText}
          <span className={`cursor ${showCursor ? "visible" : ""}`}></span>
        </h1>
        <div className="scroll-indicator">
          <ChevronDown className="arrow-icon first-arrow" size="9rem" />
          <ChevronDown className="arrow-icon second-arrow" size="9rem" />
          <ChevronDown className="arrow-icon third-arrow" size="9rem" />
        </div>
      </div>

      <div className="upload-section">
        <p className="subtitle">Upload a file to check for malicious content.</p>

        <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          {file ? (
            <div className="file-box">
              <div className="file-info">
                <p>{file.name}</p> {/* Display the original file name */}
                <button className="remove-file" onClick={resetScan}>❌</button> {/* Cross to remove file */}
              </div>
            </div>
          ) : (
            <div>
              <UploadCloud className="icon" />
              <p>Drag & drop a file here, or click to select one</p>
            </div>
          )}
        </div>

        {!scanResult && (
          <button className="scan-button" onClick={checkForMalware} disabled={!file || isLoading}>
            {isLoading ? <span className="loader"></span> : "Check for Malware"}
          </button>
        )}

        {scanResult && (
          <>
            <div className={`result-tile ${scanResult.some(line => line.includes("❌")) ? "malicious" : "clean"}`}>
              {scanResult.map((line, index) => (
                <p key={index}>{line}</p> // Each line will be printed in the same container
              ))}
              {riskScore !== null && <p>Risk Score: {riskScore}</p>}
            </div>
            <div className="check-another-section">
              <button className="scan-button" onClick={resetScan}>
                Check Another File
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Home;
