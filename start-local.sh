#!/bin/bash

echo "🍎 Starting TechRFP Finder for Apple Silicon M1 Ultra..."

# Function to kill processes on a port
kill_port() {
    local port=$1
    echo "Checking port $port..."
    
    # Find and kill processes using the port
    if command -v lsof > /dev/null; then
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
    else
        # Alternative method if lsof is not available
        sudo pkill -f "PORT=$port" 2>/dev/null || true
        sudo pkill -f ":$port" 2>/dev/null || true
    fi
}

# Clean up existing servers
echo "Cleaning up existing processes..."
kill_port 3000
kill_port 3001
kill_port 8080
sleep 2

# Build the project
echo "Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "Starting server on port 3000..."
    
    # Try port 3000, then 3001 if busy
    PORT=3000 node server-simple.js &
    server_pid=$!
    
    # Wait a moment to see if server starts
    sleep 3
    
    if kill -0 $server_pid 2>/dev/null; then
        echo "🚀 Server running successfully!"
        echo "🌐 Open: http://localhost:3000"
        wait $server_pid
    else
        echo "Port 3000 busy, trying port 3001..."
        PORT=3001 node server-simple.js
    fi
else
    echo "❌ Build failed. Check the errors above."
    exit 1
fi