## Malware Detection Web Application

## Overview
This is a **Malware Detection Web Application** that allows users to upload files for malware analysis. The system performs multiple static analysis checks and integrates with **VirusTotal API** to detect potential threats.

## Features
- **File Upload & Analysis:** Supports **PDF, DOCX, EXE** file formats.
- **VirusTotal API Integration:** Scans files against known malware signatures.
- **Entropy Checking:** Identifies packed or obfuscated files.
- **Suspicious Imports Detection:** Flags potentially dangerous function calls.
- **PDF Analysis:** Checks for suspicious elements within PDFs.
- **DOCX Analysis:** Identifies macros or suspicious keywords.
- **Yara Scan:** Provides additional malware assessment.
- **Risk Scoring:** Displays a malware risk score for uploaded files.
- **Modern UI:** Built with **React**, featuring a responsive and interactive design.

## Repository Structure
```
KrackHack-25-Malware/
│── Backend/
│   │── myenv/               # Python virtual environment
│   │── node_modules/        # Backend dependencies
│   │── uploads/             # Uploaded files storage
│   │── .env                 # Environment variables
│   │── malware_scan.py      # Python script for malware scanning
│   │── package-lock.json    # Node.js package lock file
│   │── package.json         # Node.js dependencies
│   │── server.js            # Backend server (Express.js)
│   │── yara_rules.yar       # YARA rule set for malware detection
│
│── Frontend/
│   │── node_modules/        # Frontend dependencies
│   │── public/              # Static assets
│   │── src/                 # React source code
|   |   |── Components/      # Contains reusable UI components
|   |   |   |── Footer.css   # Styles for the Footer component
|   |   |   |── Footer.jsx   # Footer component (React)
|   |   |   |── Navbar.css   # Styles for the Navbar component
|   |   |   |── Navbar.jsx   # Navigation bar component (React)
|   |   |── App.css          # Global styles for the main App component
|   |   |── App.jsx          # Root component that manages the application structure
|   |   |── Home.css         # Styles for the Home page
|   |   |── Home.jsx         # Home page component (React)
|   |   |── main.jsx         # Entry point for React application, renders App component
│   │── .env                 # Frontend environment variables
│   │── eslint.config.js     # ESLint configuration
│   │── index.html           # Main frontend HTML file
│   │── package-lock.json    # Frontend package lock file
│   │── package.json         # Frontend dependencies
│   │── vite.config.js       # Vite configuration for frontend
│
│── .gitignore               # Ignore unnecessary files
│── README.md                # Documentation
```

## Tech Stack
### Frontend:
- **React.js** (JSX, Tailwind CSS for styling)
- **Lucide React Icons** (for UI enhancements)
- **File Upload & Drag-Drop Support**

### Backend:
- **Node.js & Express.js**
- **VirusTotal API** for malware analysis
- **Custom Python Scripts** for entropy checking & static analysis

### Python Analysis Tools:
- **yara** for rule-based malware detection
- **pefile** for analyzing PE (Windows executable) files
- **pdfplumber** for extracting data from PDFs
- **olefile** for inspecting OLE files (DOCX, XLSX, etc.)
- **requests** for API calls
- **hashlib** for file hashing
- **math & json** for data processing

## Setup & Installation
### 1. Clone the Repository
```sh
git clone https://github.com/your-repo/malware-scanner.git
cd KrackHack-25-Malware
```

### 2. Install Dependencies
#### Install Node.js & Frontend Dependencies
```sh
# Install frontend dependencies
cd Frontend
npm install
```

#### Install Backend Dependencies
```sh
cd ../Backend
npm install
```

#### Set Up Python Virtual Environment & Install Dependencies
```sh
cd ../Backend
pip install yara-python pefile pdfplumber olefile requests dotenv
```

### 3. Set Up Environment Variables
Create `.env` file in the backend directory:
```sh
VIRUSTOTAL_API_KEY=your_api_key_here
UPLOAD_DIR=uploads
PYTHON_PATH=your_python.exe_file_path_here
PORT=5000
```
Create `.env` file in the frontend directory:
```sh
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Run the Application
```sh
# Start the backend server
cd Backend
node server.js

# Start the frontend
cd ../Frontend
npm run dev
```

## Backend Code Summary
The **backend** is implemented using **Node.js & Express.js**, handling file uploads and running malware scans via a **Python script**.

### **Key Functionalities in `server.js`**
- **File Upload Handling**
  - Uses `multer` for file uploads (supports `.exe, .dll, .pdf, .docx, .doc`).
  - Stores files in the `uploads/` directory.

- **Python Malware Scan Execution**
  - Spawns a Python process to execute `malware_scan.py` with the uploaded file as an argument.
  - Captures output and sends JSON results back to the client.

- **CORS Configuration**
  - Allows cross-origin requests from the frontend.

- **Error Handling**
  - Handles file format errors and API failures.

### **File Scan Process**
1. **Upload a file** via API.
2. **Server saves the file** and validates its format.
3. **Python script analyzes the file**, checking:
   - **Entropy (Packed/Obfuscated files)**
   - **Suspicious Imports (DLL Calls)**
   - **PDF & DOCX Macro Analysis**
   - **YARA Rules for Malware Detection**
   - **VirusTotal Malware Signature Database**
4. **Results returned to the client** as JSON.

---

## Usage
1. **Upload a file** via the drag-and-drop interface.
2. Click **Scan** to analyze the file.
3. View the **malware detection results & risk score**.
4. Check **detailed reports** for potential threats.
5. Upload another file or analyze further.

## Contributors
- **Dhairya Sharma**
- **Garv Jain**
- **Parth Ashok Gawande**
- **Dishant Jha**

---
**Disclaimer:** This tool provides **static analysis** and should not be used as a sole security measure. Always use it in combination with other security practices.
#
