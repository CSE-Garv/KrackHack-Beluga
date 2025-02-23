import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="marquee">
        <span>
          Our PS: Malware poses a significant threat to organizations and individuals by compromising security, privacy, and data integrity. Traditional antivirus solutions can be slow to update their databases and are often inaccessible to novice users who just want a quick check on a suspicious file. Your task is to build a web application that performs static analysis on uploaded files (e.g., .exe, .docx, .pdf), flags malicious indicators, and provides a clear verdict (“Malicious” or “Clean”). This system must be easy to use, offer concise results, and emphasize static analysis (no sandboxing or dynamic execution).
        </span>
        
      </div>
    </nav>
  );
};

export default Navbar;
