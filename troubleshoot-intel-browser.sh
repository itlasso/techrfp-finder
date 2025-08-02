#!/bin/bash

echo "Intel Mac Browser Troubleshooting Guide"
echo "======================================="

# Test server connectivity
echo "1. Testing server connectivity..."
if curl -s http://localhost:5000/api/rfps > /dev/null; then
    echo "✅ Server responding on localhost:5000"
else
    echo "❌ Server not responding - restart with npm run dev"
    exit 1
fi

# Test IPv4 direct
echo ""
echo "2. Testing IPv4 direct connection..."
if curl -s http://127.0.0.1:5000/api/rfps > /dev/null; then
    echo "✅ IPv4 connection working"
    echo "   Try in browser: http://127.0.0.1:5000"
else
    echo "❌ IPv4 connection failed"
fi

# Check port binding
echo ""
echo "3. Checking port binding..."
netstat -an 2>/dev/null | grep 5000 || lsof -i :5000 2>/dev/null || echo "Port check tools not available"

# Browser test URLs
echo ""
echo "4. Browser Test URLs (try in order):"
echo "   API: http://127.0.0.1:5000/api/rfps"
echo "   API: http://localhost:5000/api/rfps" 
echo "   App: http://127.0.0.1:5000"
echo "   App: http://localhost:5000"

echo ""
echo "5. Browser Troubleshooting Steps:"
echo "   a) Open Developer Tools (Cmd+Option+I)"
echo "   b) Clear all data: Application → Storage → Clear All"
echo "   c) Disable extensions: Use incognito/private mode"
echo "   d) Hard refresh: Cmd+Shift+R multiple times"
echo "   e) Try different browser (Safari vs Chrome)"

echo ""
echo "6. Force IPv4 DNS Resolution:"
echo "   Add to /etc/hosts: 127.0.0.1 localhost"
echo "   Command: echo '127.0.0.1 localhost' | sudo tee -a /etc/hosts"

echo ""
echo "7. Alternative startup with explicit binding:"
echo "   HOST=0.0.0.0 PORT=5000 npm run dev"