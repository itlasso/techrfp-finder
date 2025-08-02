# TechRFP Finder - Intel Mac Setup Guide

## System Requirements for Intel iMac
- Intel Core i9 processor (3.6 GHz 10-Core optimized)
- Node.js 18 LTS or 20 LTS (Intel optimized builds)
- npm 8+ or yarn
- Git

## Quick Setup

### 1. Install Node.js (Intel Optimized)
```bash
# Install Node.js 20 LTS (Intel build)
brew install node@20

# Or download directly from nodejs.org (Intel x64 build)
# https://nodejs.org/en/download/
```

### 2. Clone and Setup
```bash
git clone https://github.com/itlasso/techrfp-finder.git
cd techrfp-finder
npm install
```

### 3. Start Development Server (Intel Mac)
```bash
# Method 1: Use Intel-optimized script (recommended)
./start-local-intel.sh

# Method 2: Manual environment setup
HOST=localhost PORT=5000 npm run dev
```

### 4. Access Application
- Primary: http://localhost:5000 (links work properly)
- Alternative: http://127.0.0.1:5000

## Intel-Specific Optimizations

### Performance Settings
```bash
# Set Node.js memory limit for Intel processors
export NODE_OPTIONS="--max-old-space-size=8192"

# Enable Intel-specific V8 optimizations
export NODE_OPTIONS="$NODE_OPTIONS --use-largepages=silent"
```

### Troubleshooting Intel iMac

**Port Issues:**
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process if needed
sudo kill -9 <PID>
```

**Node.js Issues:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

**Network Access:**
- Application accessible at localhost:5000
- Intel Macs typically have no networking issues with Node.js
- Firewall settings may need adjustment for external access

## Production Features Available
- Professional RFP database with real procurement opportunities
- Advanced filtering by technology stack (Drupal prioritized)
- Document download tracking and analytics
- Professional contact and inquiry systems
- SAM.gov integration framework (ready for API keys)

## Development Commands
```bash
./start-local-intel.sh   # Start Intel Mac optimized server (recommended)
HOST=localhost npm run dev   # Alternative local development
npm run build        # Build for production
npm run db:push      # Deploy database schema
npm start            # Start production server
```

## System Monitoring
```bash
# Monitor system resources
top -pid $(pgrep node)

# Check memory usage
ps aux | grep node

# Monitor network connections
netstat -an | grep 5000
```