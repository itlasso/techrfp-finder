# TechRFP Finder

A professional web application for discovering technology RFPs from government procurement databases, with SAM.gov integration.

## Features

- 🔍 **Real Data Integration** - Connects to SAM.gov for authentic federal procurement opportunities
- 🎯 **Smart Filtering** - Filter by technology (Drupal, WordPress, React, etc.), budget, deadline, organization type
- 🏛️ **Professional Sources** - Universities, government agencies, federal contracts
- 📊 **Advanced Search** - Comprehensive search with sorting and pagination
- 🎨 **Modern UI** - Built with React, TypeScript, and TailwindCSS
- 🔄 **Real-time Updates** - Live data from federal procurement systems

## Quick Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/itlasso/techrfp-finder.git
   cd techrfp-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure SAM.gov API (Optional)**
   - Get your API key from [SAM.gov Account Details](https://sam.gov)
   - Add to environment variables:
   ```bash
   export SAM_GOV_API_KEY="your-api-key-here"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5000`

## SAM.gov API Setup

To use real federal procurement data:

1. Register at [SAM.gov](https://sam.gov)
2. Navigate to "Account Details" in your dashboard
3. Request API access for Public API
4. Copy your 40-character API key
5. Set the `SAM_GOV_API_KEY` environment variable

The application works with professional demo data when the API key is not configured.

## Architecture

- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Express.js + TypeScript
- **Data**: SAM.gov API integration with smart fallbacks
- **Build**: Vite for fast development and builds
- **UI Components**: shadcn/ui + Radix primitives

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## API Integration

The application integrates with:
- **SAM.gov Opportunities API** - Federal procurement opportunities
- **Smart fallback system** - Professional demo data when API unavailable
- **Real-time filtering** - Technology, budget, deadline, organization filters

## Support

For SAM.gov API issues, contact [FSD Support](https://www.fsd.gov).

For application issues, create an issue on GitHub.