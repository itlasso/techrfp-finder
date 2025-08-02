# Intel Mac Troubleshooting Guide

## Quick Start Steps

1. **Navigate to project directory:**
   ```bash
   cd techrfp-finder
   ```

2. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   # Simple method:
   ./start-local-simple.sh
   
   # Or manual method:
   HOST=localhost PORT=5000 npm run dev
   ```

4. **Open browser:**
   Navigate to http://localhost:5000

## Common Issues and Solutions

### Issue: "Permission denied" when running script
```bash
chmod +x start-local-simple.sh
chmod +x start-local-intel.sh
```

### Issue: "tsx command not found"
```bash
npm install
# or
npm install -g tsx
```

### Issue: Port 5000 already in use
```bash
# Find process using port 5000:
sudo lsof -i :5000

# Kill the process (replace PID with actual number):
kill -9 <PID>

# Or use different port:
HOST=localhost PORT=3000 npm run dev
```

### Issue: Links return 404 errors
1. Clear browser cache (Cmd+Shift+R)
2. Ensure server is running on localhost (not 127.0.0.1)
3. Check browser URL matches server address

### Issue: Node.js version problems
```bash
# Check Node.js version:
node --version

# Should be 18.x or 20.x
# If not, install correct version:
brew install node@20
```

### Issue: Module not found errors
```bash
# Clear and reinstall:
rm -rf node_modules package-lock.json
npm install
```

## Verification Steps

Test these endpoints to verify everything works:

```bash
# 1. Main app
curl http://localhost:5000

# 2. API endpoints
curl http://localhost:5000/api/rfps
curl http://localhost:5000/api/rfps/university-research/document

# 3. Individual RFP
curl http://localhost:5000/api/rfps/a7dbc4d2-d166-4a3a-9882-0c656b3cce7f
```

If all return proper responses (HTML for main app, JSON for APIs), your setup is working correctly.