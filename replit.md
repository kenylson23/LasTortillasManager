# Las Tortilhas Restaurant Management System

## Overview

This is a comprehensive restaurant management system built for "Las Tortilhas" restaurant. The application provides a complete solution for managing menu items, orders, tables, staff, customers, inventory, and analytics. It features a modern web interface with real-time updates and a responsive design optimized for both desktop and mobile devices.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens for warm restaurant-themed colors
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript throughout the entire stack
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM with type-safe queries
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage

### Database Architecture
- **Primary Database**: PostgreSQL hosted on Neon
- **Connection**: Neon serverless with WebSocket support
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Storage**: PostgreSQL-backed session store for authentication

## Key Components

### Authentication System
- **Provider**: Traditional PostgreSQL username/password authentication
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **User Management**: Complete user profile system with roles and local user storage
- **Security**: Bcrypt password hashing, HTTP-only session cookies, secure session handling
- **Features**: User registration, login, logout, password encryption

### Menu Management
- Full CRUD operations for menu items
- Category-based organization (Tortilhas, Burritos, Tacos, etc.)
- Image upload support for menu items
- Availability tracking and pricing management

### Order Management
- Real-time order tracking with status updates
- Order workflow: Pending → Preparing → Ready → Completed
- Order details with itemized breakdown
- Table assignment and customer tracking

### Table Management
- Visual table grid with real-time status updates
- Table states: Available, Occupied, Reserved, Maintenance
- Capacity tracking and reservation system
- Interactive table selection interface

### Staff Management
- Employee profiles with role-based access
- Shift tracking and availability management
- Contact information and performance metrics

### Customer Management
- Customer profiles with order history
- Loyalty tracking and preferences
- Contact information and visit statistics

### Inventory Management
- Stock tracking with low-stock alerts
- Supplier information and reorder levels
- Cost tracking and inventory valuation

### Analytics & Reporting
- Daily sales statistics and revenue tracking
- Weekly sales charts and trend analysis
- Popular dishes analysis with visual charts
- Table occupancy and staff performance metrics

## Data Flow

### Client-Server Communication
1. **Authentication Flow**: User authenticates via Replit Auth → Server validates and creates session → Client receives user data
2. **API Requests**: Client uses TanStack Query → Makes authenticated requests to Express API → Server processes with Drizzle ORM → Returns JSON responses
3. **Real-time Updates**: Client polls for updates → Server provides fresh data → UI updates reactively

### Database Operations
1. **Schema Definition**: Centralized schema in `shared/schema.ts` using Drizzle ORM
2. **Data Access**: Storage layer abstracts database operations
3. **Validation**: Zod schemas ensure type safety across client and server
4. **Migrations**: Drizzle Kit handles schema changes and migrations

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Query)
- Express.js with TypeScript support
- Drizzle ORM with PostgreSQL adapter
- Neon serverless database client

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
- Recharts for data visualization

### Development Tools
- Vite for development server and build process
- TypeScript for type safety
- ESBuild for server-side bundling
- Replit-specific development plugins

### Authentication and Security
- Replit Auth OpenID Connect client
- Express session middleware
- PostgreSQL session store
- Passport.js for authentication strategies

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app with TypeScript and Tailwind
2. **Server Build**: ESBuild bundles Express server with external dependencies
3. **Database Setup**: Drizzle migrations ensure schema is up-to-date
4. **Asset Optimization**: Vite optimizes static assets for production

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Session secrets and authentication configuration
- Replit-specific environment variables for auth integration

### Production Deployment
- Server serves both API endpoints and static frontend assets
- Database runs on Neon serverless infrastructure
- Sessions and authentication handled securely with proper cookie configuration

## Default Admin User

The system includes a default admin user for initial access:

- **Username**: admin
- **Password**: admin123
- **Email**: admin@lastortilhas.com
- **Role**: admin

**Important**: Change the default password after first login for security.

## Changelog

```
Changelog:
- July 06, 2025. Initial setup
- July 06, 2025. Migrated from Replit Auth to PostgreSQL username/password authentication
  * Replaced OpenID Connect with traditional login system
  * Added user registration, login, and logout functionality
  * Implemented bcrypt password hashing for security
  * Created dedicated auth page with login/register forms
  * Updated user schema with username, password, and user fields
- July 06, 2025. Added standardized admin user setup
  * Created default admin user with standardized credentials
  * Added admin setup script for future deployments
  * Fixed database connection issues by setting up PostgreSQL
  * Ensured proper database schema deployment
- January 19, 2025. Prepared project for Vercel deployment
  * Created api/index.ts as serverless function entry point
  * Updated vercel.json with correct TypeScript configuration
  * Added CORS support for production deployment
  * Created build scripts and migration guide
  * Maintained PostgreSQL Neon database compatibility
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```