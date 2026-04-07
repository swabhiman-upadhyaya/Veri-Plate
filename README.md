# 🚗 VeriPlate — License Plate Detection System

A production-ready **License Plate Detection System** built on the **MERN stack** integrated with **Machine Learning**, enabling automated vehicle identification and compliance tracking.

---

## 🏗️ Architecture

- **Frontend**: React (Vite), Tailwind CSS, Context API for state management  
- **Backend**: Node.js, Express.js, MongoDB  
- **Authentication**: JSON Web Tokens (JWT) with OTP-based verification  
- **ML/OCR Layer**: Mock OCR pipeline for license plate extraction  

---

## ✨ Features

- **🔐 OTP Authentication**  
  Secure email-based login using One-Time Password (OTP) verification.

- **📸 Real-Time Plate Detection**  
  Extracts license plate numbers from uploaded images via OCR simulation.

- **📊 Dynamic Status Engine**  
  Automatically evaluates validity of:
  - Vehicle Insurance  
  - Driving License  
  - Pollution Certificate  

- **⚠️ Automated Alerts**  
  Generates instant warnings for expired or soon-to-expire documents.

- **📁 History Tracking**  
  Maintains a centralized log of scanned vehicles and detected violations.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

---

### 1️⃣ Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
