# Overview

TechRFP Finder is a web application that helps developers and technology professionals discover relevant Request for Proposal (RFP) opportunities. The platform allows users to search, filter, and browse technology RFPs from various organizations including educational institutions, government agencies, and private companies. Users can filter opportunities by technology stack (Drupal, WordPress, React, etc.), budget range, deadline, and organization type.

# User Preferences

Preferred communication style: Simple, everyday language.
GitHub repository: https://github.com/itlasso
CMS preference: Drupal is the go-to CMS (prioritized in search results and highlighted)

# System Architecture

## Frontend Architecture
The application uses a modern React-based frontend built with TypeScript and Vite as the build tool. The UI is constructed using shadcn/ui components built on Radix UI primitives, providing a consistent and accessible design system. TailwindCSS handles styling with a custom design system featuring brand colors (orange, teal, black, white). The frontend implements client-side routing using Wouter for navigation and TanStack Query for server state management and data fetching.

## Backend Architecture
The backend is an Express.js server written in TypeScript that serves both API endpoints and static files. The server uses a middleware-based architecture with custom logging, error handling, and request/response processing. In development, it integrates with Vite's development server for hot module replacement and seamless development experience.

## Data Storage Solutions
The application uses a dual storage approach. In development and demo environments, it relies on an in-memory storage implementation with seeded mock data for RFPs. For production, it's configured to use PostgreSQL as the primary database with Drizzle ORM for type-safe database operations and schema management. The database schema includes tables for RFPs and users, with comprehensive filtering and search capabilities.

## API Structure
The REST API provides endpoints for RFP operations including listing RFPs with filtering capabilities, retrieving individual RFPs by ID, and generating technology statistics for filter options. The API supports query parameters for search, technology filtering, deadline filtering, budget range filtering, and organization type filtering. All responses are JSON-formatted with proper error handling and HTTP status codes.

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