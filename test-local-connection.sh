#!/bin/bash

echo "Testing TechRFP Finder Local Connection..."
echo "=========================================="

# Check if server is running
if curl -s http://localhost:5000/api/rfps > /dev/null; then
    echo "✅ Server is running and responding"
    echo ""
    echo "API Test:"
    curl -s http://localhost:5000/api/rfps | head -3
    echo ""
    echo "🌐 Browser URLs to try:"
    echo "   Main app: http://localhost:5000"
    echo "   API test: http://localhost:5000/api/rfps"
    echo "   IPv4 alt: http://127.0.0.1:5000"
else
    echo "❌ Server not responding"
    echo "Start server with: ./start-intel-mac.sh"
fi