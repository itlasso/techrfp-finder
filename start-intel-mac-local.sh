#!/bin/bash

# TechRFP Finder - Intel Mac Local Development
echo "Starting TechRFP Finder on Intel Mac..."

# Kill existing processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
sleep 2

# Set environment for IPv4 binding
export NODE_ENV=development
export HOST=127.0.0.1
export PORT=5000

echo "Server binding to: 127.0.0.1:5000"
echo "Browser access: http://localhost:5000"
echo "Alternative: http://127.0.0.1:5000"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting development server..."
npm run dev
