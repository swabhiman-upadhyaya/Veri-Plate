# VeriPlate — License Detection System

A production-ready License Plate Detection System built on the MERN stack.

## Architecture
- **Frontend**: React + Vite, Tailwind CSS, Context API for state management.
- **Backend**: Node.js, Express, MongoDB, JSON Web Tokens (JWT) for authentication.

## Features
- **OTP Authentication**: Secure email-based OTP login.
- **Real-Time Lookup**: Mock OCR service for extracting plate numbers from images.
- **Dynamic Status**: Auto-computation of vehicle insurance, license, and pollution expiry.
- **Automated Alerts**: Generates warnings for expiring documents.
- **History Tracking**: Centralized log of all scanned vehicles and violations.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)

### 1. Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure your credentials.
4. Seed the database with sample data: `npm run seed`
5. Start the development server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`.
4. Start the Vite server: `npm run dev`

## Accessing the System
After both servers are running, access the dashboard via `http://localhost:5173`. Use the dummy admin account created by the seed script:
- **Email**: `admin@veriplate.com`
- Check your console (or Ethereal Email) for the generated OTP to login.
