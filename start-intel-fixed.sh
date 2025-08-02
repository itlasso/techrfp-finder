#!/bin/bash

# TechRFP Finder - Intel Mac with IPv4 binding
echo "Starting TechRFP Finder (Intel Mac IPv4 fix)..."

# Kill existing processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
sleep 2

# Force IPv4 binding for Intel Mac compatibility
export NODE_ENV=development
export HOST=127.0.0.1
export PORT=5000

echo "Server will bind to IPv4: http://127.0.0.1:5000"
echo "Browser access: http://localhost:5000"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting server..."
npm run dev