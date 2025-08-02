#!/bin/bash

# Simple Intel Mac starter - no port checking
echo "TechRFP Finder - Simple Intel Mac Start"
echo "========================================"

# Set local development environment
export NODE_ENV=development
export HOST=localhost
export PORT=5000

echo "Environment configured:"
echo "  NODE_ENV: $NODE_ENV"
echo "  HOST: $HOST"
echo "  PORT: $PORT"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting server..."
echo "Navigate to: http://localhost:5000"
echo "Press Ctrl+C to stop"
echo ""

# Start with npm script
npm run dev