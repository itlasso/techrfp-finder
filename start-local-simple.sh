#!/bin/bash

# TechRFP Finder - Simple Intel Mac Start
echo "Starting TechRFP Finder..."

# Set environment for localhost binding
export NODE_ENV=development
export HOST=localhost
export PORT=5000

echo "Server will start at: http://localhost:5000"
echo "Press Ctrl+C to stop"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server
npm run dev
