# VinOBuddy

VinOBuddy is a mobile-friendly web app (iOS + Android) that lets users scan or enter a VIN number, fetch vehicle data from NHTSA & NMVTIS, and summarize it with Hugging Face AI.

## Features
- Dark green theme, clean UI
- VIN input or camera scanning (barcode detection)
- Fetch engine, AWD, recalls, title brands, etc.
- AI-generated natural-language summary
- Primary + backup Hugging Face API keys

## Setup
1. Server:
   ```bash
   cd server
   npm install
   PRIMARY_HF_KEY=your_key FALLBACK_HF_KEY=your_key NMVTIS_KEY=your_key npm start
   ```
2. Client:
   ```bash
   cd client
   npm install
   npm run dev
   ```
3. Open http://localhost:3000

## Deployment
- Host client on Vercel
- Host server on any Node.js supporting host
- Set environment variables securely
