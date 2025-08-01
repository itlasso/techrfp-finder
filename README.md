# TechRFP Finder

A web application for discovering and browsing technology Request for Proposal (RFP) opportunities. Built with React, TypeScript, and Express.js, featuring a modern interface with custom orange/teal branding.

## Features

- **Smart Search**: Search RFPs by keywords, organization, technology, or description
- **Advanced Filtering**: Filter by technology type (Drupal, WordPress, React, etc.), budget range, deadline, and organization type
- **Drupal Priority**: Special highlighting and priority for Drupal projects
- **Responsive Design**: Modern, mobile-friendly interface with custom orange/teal color scheme
- **Real-time Data**: Live filtering and search results
- **Professional Cards**: Detailed RFP information with budget, deadlines, and contact details

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling with custom design system
- **shadcn/ui** components built on Radix UI
- **TanStack Query** for server state management
- **Wouter** for lightweight client-side routing

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** with PostgreSQL support
- **In-memory storage** for development/demo
- **RESTful API** with comprehensive filtering

## Installation

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Option 1: Download ZIP File

1. **Download the complete application:**
   - Go to https://github.com/itlasso/techrfp-finder
   - Click the green "Code" button
   - Select "Download ZIP"
   - Extract the ZIP file to your desired location

2. **Navigate to the project folder:**
```bash
cd techrfp-finder-main
```

### Option 2: Clone the Repository

```bash
git clone https://github.com/itlasso/techrfp-finder.git
cd techrfp-finder
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Setup (Optional)

For production deployment with PostgreSQL:

```bash
cp .env.example .env
```

Edit `.env` and add your database connection:
```
DATABASE_URL=your_postgresql_connection_string
```

### Step 4: Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions and configuration
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage interface and implementation
│   └── vite.ts            # Vite integration
├── shared/                 # Shared TypeScript types and schemas
│   └── schema.ts          # Database schema and types
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## API Endpoints

### GET /api/rfps
Retrieve RFPs with optional filtering

**Query Parameters:**
- `search` - Search term for title, organization, description, or technology
- `technologies` - Array of technology names to filter by
- `deadlineFilter` - Filter by deadline ("7", "30", "90" for days)
- `budgetRange` - Budget range filter ("0-50000", "50000-100000", etc.)
- `organizationTypes` - Array of organization types

**Example:**
```bash
curl "http://localhost:5000/api/rfps?technologies=Drupal&budgetRange=100000-500000"
```

### GET /api/rfps/:id
Get a specific RFP by ID

### GET /api/rfps/stats/technologies
Get technology statistics for filter counts

## Connecting to GitHub

### Initial Setup

1. **Create a new repository on GitHub:**
   - Go to https://github.com/itlasso
   - Click "New repository"
   - Name it `techrfp-finder`
   - Don't initialize with README (we already have one)

2. **Connect your local repository:**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: TechRFP Finder application"

# Add your GitHub repository as origin
git remote add origin https://github.com/itlasso/techrfp-finder.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Ongoing Development Workflow

```bash
# Make your changes, then:
git add .
git commit -m "Description of your changes"
git push origin main
```

### Setting up GitHub Pages (Optional)

To deploy your app using GitHub Pages:

1. Install the `gh-pages` package:
```bash
npm install --save-dev gh-pages
```

2. Add deployment script to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

## Configuration

### Custom Colors
The application uses a custom color scheme defined in `client/src/index.css`:
- **Primary Orange**: `#ff851b` (hsl(27, 100%, 55%))
- **Secondary Teal**: `#008080` (hsl(180, 100%, 25%))
- **Black**: `#000000`
- **White**: `#ffffff`

### Database Configuration
- **Development**: Uses in-memory storage with seeded data
- **Production**: Configure PostgreSQL connection via `DATABASE_URL` environment variable

## Deployment

### Replit Deployment
This project is optimized for Replit Deployments:

1. Push your code to GitHub
2. Import the repository to Replit
3. Click the "Deploy" button in Replit
4. Your app will be available at a `.replit.app` domain

### Other Platforms
The application can be deployed to any Node.js hosting platform:
- Vercel
- Netlify
- Heroku
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Note**: This application prioritizes Drupal RFPs as specified, with special highlighting and sorting priority for Drupal-based projects.