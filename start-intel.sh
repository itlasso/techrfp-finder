#!/bin/bash

# TechRFP Finder - Intel iMac Startup Script
echo "🚀 Starting TechRFP Finder on Intel iMac..."

# Set environment for local development
export NODE_ENV=development
export PORT=5000
export HOST=localhost

# Check if SAM.gov API key is available
if [ -f .env ]; then
    echo "📋 Loading environment variables from .env"
    source .env
else
    echo "⚠️  No .env file found - using demo data mode"
    echo "💡 Create .env file with SAM_GOV_API_KEY for real data"
fi

# Optimize for Intel processors
export NODE_OPTIONS="--max-old-space-size=4096"

echo "🖥️  Intel Core i9 optimizations enabled"
echo "🌐 Starting server at http://localhost:5000"
echo "📝 Alternative access: http://127.0.0.1:5000"

# Start the application
npm run dev