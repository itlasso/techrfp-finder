#!/usr/bin/env node

// Apple Silicon M1/M2 optimized server
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🍎 Starting TechRFP Finder on Apple Silicon...');

const app = express();
const server = createServer(app);

// Apple Silicon networking configuration
const port = parseInt(process.env.PORT || '3000');
const host = '127.0.0.1'; // Force IPv4 localhost for M1 compatibility

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// Mock API endpoints for demo
const mockRfps = [
  {
    id: '1',
    title: 'University CMS Migration to Drupal',
    organization: 'State University System',
    technology: 'Drupal',
    budgetMin: 150000,
    budgetMax: 200000,
    deadline: '2025-09-15',
    organizationType: 'Education'
  },
  {
    id: '2', 
    title: 'Municipal Website Development',
    organization: 'City Government',
    technology: 'WordPress',
    budgetMin: 80000,
    budgetMax: 120000,
    deadline: '2025-08-30',
    organizationType: 'Government'
  }
];

app.get('/api/rfps', (req, res) => {
  res.json(mockRfps);
});

app.get('/api/rfps/stats/technologies', (req, res) => {
  res.json({ 'Drupal': 1, 'WordPress': 1 });
});

app.get('/api/rfps/:id', (req, res) => {
  const rfp = mockRfps.find(r => r.id === req.params.id);
  if (rfp) {
    res.json(rfp);
  } else {
    res.status(404).json({ message: 'RFP not found' });
  }
});

// Serve main application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// Apple Silicon specific server binding
server.listen({
  port,
  host,
  ipv6Only: false,
}, () => {
  console.log(`✅ TechRFP Finder running on Apple Silicon M1 Ultra`);
  console.log(`🌐 Open: http://${host}:${port}`);
  console.log(`📱 Alternative: http://localhost:${port}`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  if (err.code === 'ENOTSUP') {
    console.log('💡 Apple Silicon networking issue detected');
    console.log('   Try: sudo npm run dev (if permission issue)');
    console.log('   Or: brew install node@20 && use Node 20 LTS');
  }
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');
  server.close();
});