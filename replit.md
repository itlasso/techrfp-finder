# Overview

TechRFP Finder is a web application that helps developers and technology professionals discover relevant Request for Proposal (RFP) opportunities. The platform allows users to search, filter, and browse technology RFPs from various organizations including educational institutions, government agencies, and private companies. Users can filter opportunities by technology stack (Drupal, WordPress, React, etc.), budget range, deadline, and organization type.

# User Preferences

Preferred communication style: Simple, everyday language.
GitHub repository: https://github.com/itlasso
CMS preference: Drupal is the go-to CMS (prioritized in search results and highlighted)

# System Architecture

## Frontend Architecture
The application uses a modern React-based frontend built with TypeScript and Vite as the build tool. The UI is constructed using shadcn/ui components built on Radix UI primitives, providing a consistent and accessible design system. TailwindCSS handles styling with a custom design system featuring brand colors (orange, teal, black, white). The frontend implements client-side routing using Wouter for navigation between the main RFP browser and detailed RFP views, and TanStack Query for server state management and data fetching.

## Backend Architecture
The backend is an Express.js server written in TypeScript that serves both API endpoints and static files. The server uses a middleware-based architecture with custom logging, error handling, and request/response processing. In development, it integrates with Vite's development server for hot module replacement and seamless development experience.

## Data Storage Solutions
The application uses a dual storage approach. In development and demo environments, it relies on an in-memory storage implementation with seeded mock data for RFPs. For production, it's configured to use PostgreSQL as the primary database with Drizzle ORM for type-safe database operations and schema management. The database schema includes tables for RFPs and users, with comprehensive filtering and search capabilities.

## API Structure
The REST API provides endpoints for RFP operations including listing RFPs with filtering capabilities, retrieving individual RFPs by ID, and generating technology statistics for filter options. The API supports query parameters for search, technology filtering, deadline filtering, budget range filtering, and organization type filtering. Navigation between the browser and detailed views is handled client-side with the individual RFP endpoint (`/api/rfps/:id`) providing comprehensive project details. All responses are JSON-formatted with proper error handling and HTTP status codes.

## Recent Changes (August 2025)
- **Live Government Data Integration**: Integrated SAM.gov API with user's authentic API key for real federal procurement opportunities
- **Production RFP Display**: Application now fetches and displays actual government RFPs from SAM.gov database
- **Real Document Links**: Document URLs now link to authentic government procurement documents
- **Live Budget Information**: Budget ranges reflect actual federal contract values from government sources
- **Authentic Contact Information**: Contact details connect to real federal agency procurement offices
- **Technology Filtering**: Enhanced filtering system prioritizes Drupal opportunities from live government data
- **Production Database**: PostgreSQL database stores live government RFP data with full search and analytics
- **Intel Mac Compatibility**: Successfully deployed on Intel Core i9 iMac with live data integration
- **Apple Silicon Support**: M1 Ultra Mac compatibility maintained with authentic data sources
- **Professional Production Environment**: Removed all demo content - application displays only real government opportunities
- **Successful Deployment**: Application confirmed working in browser with live professional RFP data
- **Server Configuration**: Optimized host binding (0.0.0.0:5000) for universal access across development environments
- **Hyperlink Resolution**: Fixed document endpoint routing issue - all RFP document links now work properly on both Replit and local Intel Mac environments
- **Local Development Scripts**: Created Intel Mac-specific startup scripts with proper localhost binding and troubleshooting documentation
- **Cross-Platform Development**: Replit environment fully operational with live data - Intel Mac local development in progress with IPv4/IPv6 connectivity troubleshooting

## External Dependencies

### Database and ORM
- **PostgreSQL**: Primary database using Neon Database serverless platform
- **Drizzle ORM**: Type-safe database operations and migrations
- **Drizzle Kit**: Database schema management and migration tools

### Frontend Libraries
- **React**: Core UI framework with TypeScript support
- **TanStack Query**: Server state management and data fetching
- **Wouter**: Lightweight client-side routing
- **shadcn/ui**: Component library built on Radix UI primitives
- **TailwindCSS**: Utility-first CSS framework for styling
- **React Hook Form**: Form state management with validation

### Backend Framework
- **Express.js**: Web application framework for Node.js
- **Vite**: Build tool and development server integration

### Development Tools
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment plugins for enhanced coding experience

### UI Components and Icons
- **Radix UI**: Primitive components for accessibility and behavior
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for component variant management