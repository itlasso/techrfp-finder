#!/bin/bash

# TechRFP Finder - Intel Mac Local Development Script
# Optimized for Intel Core i9 iMac with proper link functionality

echo "Starting TechRFP Finder for Intel Mac..."
echo "Configuring localhost binding for proper link functionality..."

# Set environment variables for Intel Mac local development
export NODE_ENV=development
export HOST=localhost
export PORT=5000

# Intel-specific Node.js optimizations
export NODE_OPTIONS="--max-old-space-size=8192"

# Simple port check and cleanup (macOS compatible)
echo "Checking for existing processes on port 5000..."
PID=$(ps aux | grep "tsx server/index.ts" | grep -v grep | awk '{print $2}')
if [ ! -z "$PID" ]; then
    echo "Found existing server process. Stopping it..."
    kill -9 $PID 2>/dev/null
    sleep 2
fi

# Alternative port check for macOS
if netstat -an | grep ":5000 " | grep -q LISTEN; then
    echo "Port 5000 is still in use. Please check manually:"
    echo "  sudo lsof -i :5000"
    echo "  kill -9 <PID>"
fi

echo "Starting server with localhost binding for Intel Mac..."
echo "Application will be available at: http://localhost:5000"
echo "All hyperlinks will work properly with this configuration"
echo "Clear browser cache if links show 404 errors (Cmd+Shift+R)"
echo ""

# Check if tsx is available
if ! command -v tsx &> /dev/null; then
    echo "tsx not found. Installing dependencies..."
    npm install
fi

# Start the development server
echo "Starting development server..."
tsx server/index.ts