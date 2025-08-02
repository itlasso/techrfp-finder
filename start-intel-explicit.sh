#!/bin/bash

echo "Starting TechRFP Finder with explicit binding..."

# Kill existing processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
sleep 2

# Explicit IPv4 binding for maximum compatibility
export NODE_ENV=development
export HOST=0.0.0.0
export PORT=5000

echo "Server binding to: 0.0.0.0:5000"
echo "This allows access from:"
echo "  - http://localhost:5000"
echo "  - http://127.0.0.1:5000"
echo "  - http://[your-local-ip]:5000"
echo ""

npm run dev