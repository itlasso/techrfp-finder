import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'dist/public')));
app.use(express.json());

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'TechRFP Finder API is working!' });
});

// Serve the main app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// Try multiple host configurations for macOS compatibility
const hosts = ['localhost', '127.0.0.1', '::1'];
let serverStarted = false;

for (const host of hosts) {
  if (serverStarted) break;
  
  try {
    app.listen(port, host, () => {
      console.log(`✅ Server running on http://${host}:${port}`);
      console.log(`🚀 TechRFP Finder ready!`);
      serverStarted = true;
    }).on('error', (err) => {
      console.log(`❌ Failed to bind to ${host}:${port} - ${err.message}`);
      if (host === hosts[hosts.length - 1] && !serverStarted) {
        console.log('💡 Try: npm run build first, then node server-simple.js');
      }
    });
    
    if (!serverStarted) {
      // Wait a bit for the async listen to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.log(`❌ Error with ${host}: ${error.message}`);
  }
}