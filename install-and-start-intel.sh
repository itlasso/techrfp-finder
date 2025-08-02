#!/bin/bash

echo "Setting up TechRFP Finder on Intel Mac..."
echo "========================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first:"
    echo "   https://nodejs.org/en/download/"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Install dependencies
echo "Installing dependencies..."
npm install

# Set environment
export NODE_ENV=development
export HOST=127.0.0.1
export PORT=5000

echo ""
echo "Starting TechRFP Finder..."
echo "Server: http://localhost:5000"
echo "Press Ctrl+C to stop"
echo ""

# Start server
npm run dev