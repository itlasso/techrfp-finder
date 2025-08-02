#!/bin/bash

# TechRFP Finder - Intel Mac Local Development Script
# Optimized for Intel Core i9 iMac with proper link functionality

echo "🚀 Starting TechRFP Finder for Intel Mac..."
echo "📍 Configuring localhost binding for proper link functionality..."

# Set environment variables for Intel Mac local development
export NODE_ENV=development
export HOST=localhost
export PORT=5000

# Intel-specific Node.js optimizations
export NODE_OPTIONS="--max-old-space-size=8192"

# Clear any existing processes on port 5000
echo "🔍 Checking for existing processes on port 5000..."
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️ Port 5000 is in use. Attempting to free it..."
    lsof -ti:5000 | xargs kill -9 2>/dev/null
    sleep 2
fi

echo "✅ Starting server with localhost binding for Intel Mac..."
echo "🌐 Application will be available at: http://localhost:5000"
echo "🔗 All hyperlinks will work properly with this configuration"
echo ""

# Start the development server
tsx server/index.ts