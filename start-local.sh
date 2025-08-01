#!/bin/bash

echo "🍎 Starting TechRFP Finder for Apple Silicon M1 Ultra..."

# Kill any existing processes
echo "Cleaning up existing processes..."
sudo pkill -f "node.*server" 2>/dev/null || true
sudo pkill -f "tsx.*server" 2>/dev/null || true

# Wait a moment
sleep 2

echo "Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Starting server..."
    PORT=3000 node server-simple.js
else
    echo "❌ Build failed. Trying development server instead..."
    echo "Using port 8080 to avoid conflicts..."
    PORT=8080 HOST=127.0.0.1 npm run dev
fi