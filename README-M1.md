# TechRFP Finder - Apple Silicon Setup

## Quick Start for M1 Ultra Mac

The application has been optimized for Apple Silicon architecture.

### Method 1: Apple Silicon Optimized Server
```bash
chmod +x server-m1.js
node server-m1.js
```

### Method 2: Use Node.js LTS (Recommended)
```bash
# Install Node.js 20 LTS (better Apple Silicon support)
brew install node@20
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

# Verify version
node --version  # Should show v20.x.x

# Run the application
npm run dev
```

### Method 3: Alternative Development Server
```bash
# Build static files
npm run build

# Serve with simple HTTP server
npx serve dist/public -l 3000
```

## Apple Silicon Specific Issues

- **ENOTSUP Error**: Common with Node.js 24.x on M1/M2
- **Socket Binding**: Use IPv4 localhost (127.0.0.1) instead of 0.0.0.0
- **Network Stack**: Apple Silicon has specific networking requirements

## Troubleshooting

1. **Port Already in Use**:
   ```bash
   sudo lsof -ti:3000 | xargs kill -9
   ```

2. **Permission Issues**:
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

3. **Node Version Issues**:
   ```bash
   nvm install 20
   nvm use 20
   ```

The application includes SAM.gov integration and will display professional demo data while API permissions are resolved.