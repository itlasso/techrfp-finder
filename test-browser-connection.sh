#!/bin/bash

echo "Testing Browser Connection for Intel Mac..."
echo "==========================================="

echo "1. Testing IPv4 direct connection:"
curl -s -w "Response: %{http_code}\n" http://127.0.0.1:5000/api/rfps | head -5

echo ""
echo "2. Testing localhost connection:"
curl -s -w "Response: %{http_code}\n" http://localhost:5000/api/rfps | head -5

echo ""
echo "3. Testing browser-friendly URLs:"
echo "   API: http://localhost:5000/api/rfps"
echo "   App: http://localhost:5000"
echo "   Alt: http://127.0.0.1:5000"

echo ""
echo "4. Browser troubleshooting:"
echo "   - Try http://127.0.0.1:5000 directly"
echo "   - Clear browser cache completely"
echo "   - Disable browser extensions"
echo "   - Try Safari if using Chrome (or vice versa)"