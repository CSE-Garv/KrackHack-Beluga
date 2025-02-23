# Malware Detection Web Application

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

## Tech Stack
### Frontend:
- **React.js** (JSX, Tailwind CSS for styling)
- **Lucide React Icons** (for UI enhancements)
- **File Upload & Drag-Drop Support**

### Backend:
- **Node.js & Express.js**
- **VirusTotal API** for malware analysis
- **Custom Python Scripts** for entropy checking & static analysis
- **MongoDB** for local data storage (if needed)

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
python -m venv myenv  # Create a virtual environment
source myenv/bin/activate  # Activate on macOS/Linux
myenv\Scripts\activate  # Activate on Windows

pip install yara-python pefile pdfplumber olefile requests
```
Alternatively, install everything from `requirements.txt` (if available):
```sh
pip install -r requirements.txt
```

### 3. Set Up Environment Variables
Create a `.env` file in the backend directory:
```sh
VITE_BACKEND_URL=http://localhost:5000
VIRUSTOTAL_API_KEY=your_api_key_here
```

### 4. Run the Application
```sh
# Start the backend server
cd Backend
source myenv/bin/activate  # Activate virtual environment (macOS/Linux)
myenv\Scripts\activate  # Activate virtual environment (Windows)
node server.js

# Start the frontend
cd ../Frontend
npm run dev
```

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

