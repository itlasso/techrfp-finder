import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

console.log('🍎 Starting TechRFP Finder on Apple Silicon...');

// Serve built static files
app.use(express.static(path.join(__dirname, 'dist/public')));
app.use(express.json());

// Mock API endpoints for local development
const mockRfps = [
  {
    id: '1',
    title: 'University CMS Migration to Drupal',
    organization: 'State University System',
    technology: 'Drupal',
    budgetMin: 150000,
    budgetMax: 200000,
    deadline: '2025-09-15',
    organizationType: 'Education',
    description: 'Comprehensive migration from legacy CMS to Drupal 10',
    location: 'California',
    contact: 'procurement@university.edu'
  },
  {
    id: '2', 
    title: 'Municipal Website Development',
    organization: 'City Government',
    technology: 'WordPress',
    budgetMin: 80000,
    budgetMax: 120000,
    deadline: '2025-08-30',
    organizationType: 'Government',
    description: 'New municipal website with citizen services portal',
    location: 'Texas',
    contact: 'webdev@city.gov'
  },
  {
    id: '3',
    title: 'Healthcare Portal Development',
    organization: 'Regional Health System',
    technology: 'React',
    budgetMin: 200000,
    budgetMax: 300000,
    deadline: '2025-10-15',
    organizationType: 'Healthcare',
    description: 'Patient portal with secure messaging and appointment scheduling',
    location: 'New York',
    contact: 'it@healthsystem.org'
  }
];

app.get('/api/rfps', (req, res) => {
  console.log('API: Serving RFPs list');
  res.json(mockRfps);
});

app.get('/api/rfps/stats/technologies', (req, res) => {
  console.log('API: Serving technology stats');
  res.json({ 'Drupal': 1, 'WordPress': 1, 'React': 1 });
});

app.get('/api/rfps/:id', (req, res) => {
  console.log(`API: Serving RFP details for ID: ${req.params.id}`);
  const rfp = mockRfps.find(r => r.id === req.params.id);
  if (rfp) {
    res.json(rfp);
  } else {
    res.status(404).json({ message: 'RFP not found' });
  }
});

// Serve the main React application
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist/public/index.html');
  console.log(`Serving React app from: ${indexPath}`);
  res.sendFile(indexPath);
});

// Apple Silicon specific binding
app.listen(port, '127.0.0.1', () => {
  console.log(`✅ TechRFP Finder running at http://127.0.0.1:${port}`);
  console.log(`🌐 Alternative access: http://localhost:${port}`);
  console.log(`📱 Ready to browse RFP opportunities!`);
});

app.on('error', (err) => {
  console.error('Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log('Port in use. Try: PORT=3001 node server-simple.js');
  }
});