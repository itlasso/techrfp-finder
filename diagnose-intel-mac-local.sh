#!/bin/bash

echo "Diagnosing Intel Mac Environment..."
echo "==================================="

echo "1. Node.js version:"
node --version 2>/dev/null || echo "❌ Node.js not found"

echo ""
echo "2. npm version:"
npm --version 2>/dev/null || echo "❌ npm not found"

echo ""
echo "3. Package.json exists:"
if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json missing"
fi

echo ""
echo "4. Node modules:"
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
else
    echo "❌ node_modules missing - need to run: npm install"
fi

echo ""
echo "5. TypeScript/tsx availability:"
npx tsx --version 2>/dev/null || echo "❌ tsx not available - need to install"

echo ""
echo "6. Server file exists:"
if [ -f "server/index.ts" ]; then
    echo "✅ server/index.ts found"
else
    echo "❌ server/index.ts missing"
fi

echo ""
echo "7. Package.json scripts:"
if [ -f "package.json" ]; then
    echo "Available scripts:"
    cat package.json | grep -A 10 '"scripts"' | head -15
fi
