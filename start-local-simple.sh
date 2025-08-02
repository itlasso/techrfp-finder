#!/bin/bash
# TechRFP Finder - Intel Mac Start Script
echo "Starting TechRFP Finder for Intel Mac..."
# Kill any existing processes on port 5000
pkill -f "PORT=5000" 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
sleep 2
# Set environment for Intel Mac localhost binding
export NODE_ENV=development
export HOST=localhost
export PORT=5000
echo "Intel Mac server will start at: http://localhost:5000"
echo "Testing connection after startup..."
echo ""
# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies for Intel Mac..."
    npm install
fi
# Start the development server optimized for Intel Mac
npm run dev &
SERVER_PID=$!
# Wait for server to start (Intel Mac may need longer)
sleep 8
# Test if server is responding
echo "Testing Intel Mac server connection..."
if curl -s http://localhost:5000/api/rfps > /dev/null; then
    echo "✅ Intel Mac server is responding correctly"
    echo "🌐 Access: http://localhost:5000"
    echo "📊 Professional RFPs loaded and ready"
else
    echo "❌ Server not responding - checking Intel Mac port conflicts"
    echo "Try: sudo lsof -i :5000"
fi
# Keep server running
wait $SERVER_PID
EOF
