#!/bin/bash

echo "============================================"
echo "   SAICA CPD Tracker - Quick Start"
echo "============================================"
echo

echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download from: https://nodejs.org/"
    exit 1
fi

echo "Node.js found. Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

echo
echo "Installation complete! Starting application..."
echo
echo "The app will open at: http://localhost:5173"
echo
echo "Press Ctrl+C to stop the application"
echo

npm run dev:all