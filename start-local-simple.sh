#!/bin/bash

# TechRFP Finder - Simple Intel Mac Start
echo "Starting TechRFP Finder for Intel Mac..."

# Kill any existing processes on port 5000
pkill -f "PORT=5000" 2>/dev/null || true
sleep 2

# Set environment for localhost binding
export NODE_ENV=development
export HOST=localhost
export PORT=5000

echo "Server will start at: http://localhost:5000"
echo "Testing connection after startup..."
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server in background and test
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test if server is responding
echo "Testing server connection..."
if curl -s http://localhost:5000/api/rfps > /dev/null; then
    echo "✅ Server is responding correctly"
    echo "🌐 Access: http://localhost:5000"
else
    echo "❌ Server not responding - check for port conflicts"
    echo "Try: sudo lsof -i :5000"
fi

# Keep server running
wait $SERVER_PID