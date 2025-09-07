# Excel Validades Dashboard

## Overview

A full-stack web application for managing and analyzing product expiration dates through Excel file uploads. The system provides a comprehensive dashboard with data visualization, statistics, and export capabilities. Built with React frontend, Express backend, and PostgreSQL database using modern TypeScript development practices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Library**: Radix UI components with shadcn/ui design system for consistent, accessible interface
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Chart.js with react-chartjs-2 for data visualizations
- **File Processing**: SheetJS (xlsx) for client-side Excel file parsing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **File Handling**: Multer for multipart file uploads with memory storage
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful endpoints with JSON responses

### Data Storage
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema**: Two main tables - users and products with proper relationships
- **Migration**: Drizzle Kit for database schema migrations
- **Session Store**: PostgreSQL-backed session storage for user authentication

### Authentication & Authorization
- **Session-based**: Traditional session cookies for user authentication
- **Password Storage**: Encrypted password storage (implementation pending)
- **Route Protection**: Middleware-based route protection for secure endpoints

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Connection**: Uses `@neondatabase/serverless` driver for optimal performance

### UI Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Lucide React**: Modern icon library with consistent design
- **shadcn/ui**: Pre-built component system built on Radix UI primitives

### Data Processing & Visualization
- **SheetJS**: Excel file reading and processing on the client side
- **Chart.js**: Powerful charting library for dashboard visualizations
- **date-fns**: Modern date utility library for date formatting and manipulation

### Development & Build Tools
- **Vite**: Fast build tool with HMR and optimized production builds
- **ESBuild**: Fast JavaScript/TypeScript bundler for server-side code
- **Replit Integration**: Development environment integration with live preview

### File Upload & Processing
- **Multer**: Node.js middleware for handling multipart/form-data
- **File Validation**: MIME type checking for .xlsx files only
- **Size Limits**: 10MB maximum file size for uploads

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema definitions