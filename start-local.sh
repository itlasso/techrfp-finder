#!/bin/bash

# Kill any existing processes on ports 3000-5000
for port in 3000 3001 5000; do
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
done

echo "Starting TechRFP Finder on macOS..."
echo "Using localhost binding for compatibility"

# Set environment variables for macOS
export NODE_ENV=development
export PORT=3000
export HOST=localhost

# Start the server
npm run dev