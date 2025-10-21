# Cloud & AI Engineer Portfolio Website

## Overview

This is a futuristic portfolio website showcasing cloud engineering and AI engineering expertise. The application is a single-page application (SPA) built with React and TypeScript on the frontend, Express on the backend, with a PostgreSQL database for storing contact form submissions. The design features a modern, hi-tech aesthetic inspired by companies like Vercel, Linear, and Apple Vision Pro, with extensive use of animations, 3D effects, and glassmorphic design elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and development server, configured for React with fast refresh
- **Wouter** for client-side routing (lightweight alternative to React Router)
- Single-page application architecture with component-based design

**UI Component System**
- **Shadcn/ui** component library (New York style variant) for consistent, accessible UI components
- **Radix UI** primitives underlying the component library for accessibility
- **Tailwind CSS** for styling with custom design tokens and dark mode support
- **Framer Motion** for animations and transitions throughout the site
- Custom theme system with CSS variables for colors, supporting dark mode by default

**State Management**
- **TanStack Query (React Query)** for server state management and API data fetching
- **React Hook Form** with Zod validation for form handling (contact form)
- Local component state with React hooks for UI interactions

**Design System**
- Dark-mode-first approach with a futuristic color palette (deep navy-black backgrounds, electric cyan accents)
- Typography using Inter for body/headings and JetBrains Mono for code/technical elements
- Responsive design with mobile-first breakpoints
- Custom animations including particle backgrounds, 3D effects, and smooth scrolling

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for the API server
- RESTful API design pattern
- Middleware-based request processing with logging
- Development and production environment configurations

**API Endpoints**
- `POST /api/contact` - Create new contact message with validation
- `GET /api/contact` - Retrieve all contact messages
- Validation using Zod schemas shared between frontend and backend

**Development Setup**
- Hot module replacement (HMR) in development via Vite middleware
- Separate build outputs for client (static files) and server (bundled Node.js app)
- Development logging with timestamp and source tracking

### Data Storage

**Database**
- **PostgreSQL** as the primary database (configured for Neon serverless)
- **Drizzle ORM** for type-safe database queries and schema management
- Schema-first approach with TypeScript types generated from database schema

**Schema Design**
- `users` table: Basic user authentication structure (id, username, password)
- `contact_messages` table: Stores contact form submissions (id, name, email, subject, message, createdAt)
- UUID primary keys with automatic generation

**Storage Abstraction**
- Interface-based storage layer (`IStorage`) for flexibility
- In-memory implementation (`MemStorage`) for development/testing
- Database implementation ready for production use with Drizzle ORM

### Authentication & Authorization

Currently implements a basic user schema but authentication is not actively used in the portfolio application. The system is prepared for future authentication features with:
- User table structure in place
- Password storage capability
- Username-based user lookup

### Build & Deployment

**Build Process**
- Frontend: Vite builds React app to `dist/public` directory
- Backend: esbuild bundles server code to `dist` directory with ESM format
- Separate development and production modes with environment-based configuration

**Scripts**
- `npm run dev` - Development server with hot reload
- `npm run build` - Production build for both client and server
- `npm start` - Run production server
- `npm run db:push` - Push database schema changes

## External Dependencies

### Third-Party Services

**Database**
- Neon Serverless PostgreSQL (`@neondatabase/serverless`)
- Connection via `DATABASE_URL` environment variable
- Drizzle Kit for migrations and schema management

**Development Tools**
- Replit-specific plugins for development environment integration
- Runtime error modal overlay for development debugging
- Cartographer and dev banner for Replit workspace integration

### Key Libraries

**UI & Styling**
- Tailwind CSS with PostCSS and Autoprefixer
- Radix UI component primitives (20+ component packages)
- Framer Motion for animations
- Lucide React for icons
- Embla Carousel for carousels

**Forms & Validation**
- React Hook Form for form state management
- Zod for schema validation
- Hookform Resolvers for integration
- Drizzle Zod for database schema validation

**Data Fetching**
- TanStack React Query for server state
- Native Fetch API for HTTP requests

**Utilities**
- date-fns for date formatting
- clsx and tailwind-merge for className utilities
- class-variance-authority for component variants
- cmdk for command menu interface

### Assets
- Profile image stored in `attached_assets` directory
- Google Fonts (Inter, JetBrains Mono) loaded via CDN
- Custom design guidelines documented in `design_guidelines.md`