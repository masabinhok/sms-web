# School Management System - Web Application

A comprehensive, enterprise-grade School Management System built with Next.js 15, TypeScript, and modern web technologies. Designed for scalability, security, and exceptional user experience across all educational roles.

## Overview

This application serves as the frontend interface for a complete school management ecosystem, providing role-based dashboards and tools for administrators, teachers, and students. Built with performance and maintainability in mind, it leverages the latest web standards and best practices.

## Core Features

### Authentication & Authorization
- Multi-role authentication system supporting Admin, Teacher, Student, and Super Admin roles
- JWT-based secure token management with automatic refresh
- Cross-domain authentication support for distributed deployments
- Password change enforcement and security policies

### Academic Management
- Comprehensive student, teacher, and staff profile management
- Class and subject organization with flexible scheduling
- Assignment creation, submission, and grading workflows
- Real-time attendance tracking and reporting
- Grade management with automated report card generation

### Communication & Collaboration
- Internal messaging system for secure communication
- Announcement broadcasting by administrators
- Activity logs and audit trails
- Role-specific dashboards with actionable insights

### User Experience
- Fully responsive design optimized for desktop, tablet, and mobile devices
- Accessible UI components following WCAG guidelines
- Intuitive navigation with role-based sidebar menus
- Real-time updates and notifications
- Comprehensive error handling and user feedback

### Security & Compliance
- HTTP-only cookies for sensitive token storage
- CSRF protection and secure headers (HSTS, CSP)
- Input validation and sanitization with Zod schemas
- XSS and injection attack prevention
- Production-grade logging and monitoring

## Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:

- **Node.js** version 18.0 or higher
- **npm**, **yarn**, or **pnpm** package manager
- **Backend API Server** running and accessible (repository: [sms-api](https://github.com/masabinhok/sms-api))

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/masabinhok/sms-web.git
cd sms-web
```

**2. Install dependencies**

```bash
npm install
```

Alternative package managers:
```bash
yarn install
# or
pnpm install
```

**3. Configure environment variables**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update the environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

**4. Start the development server**

```bash
npm run dev
```

The application will be available at [http://localhost:4000](http://localhost:4000)

## Project Architecture

### Directory Structure

```
sms-web/
├── app/                    # Next.js 15 App Router
│   ├── (public)/          # Public pages (landing page)
│   ├── (wh)/              # Authenticated routes
│   │   ├── (protected)/   # Protected dashboards
│   │   │   ├── admin/    # Admin dashboard & features
│   │   │   ├── teacher/  # Teacher dashboard & features
│   │   │   ├── student/  # Student dashboard & features
│   │   │   └── superadmin/ # Super admin features
│   │   └── auth/         # Authentication pages
│   └── api/              # API routes (proxy to backend)
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── sections/         # Page sections
│   ├── sidebar/          # Navigation components
│   └── ui/               # Reusable UI components (shadcn/ui)
├── lib/                  # Utilities and API clients
│   ├── api-client.ts     # HTTP client with auto-refresh
│   ├── env.ts            # Environment validation
│   ├── logger.ts         # Production-safe logging
│   └── constants/        # App constants
├── store/                # Zustand state management
├── types/                # TypeScript definitions
├── hooks/                # Custom React hooks
└── __tests__/            # Unit and integration tests
```

### Key Design Patterns

- **App Router**: Utilizing Next.js 15's App Router for server and client components
- **Route Groups**: Organized by authentication state and user roles
- **API Layer**: Centralized HTTP client with interceptors for authentication
- **State Management**: Zustand with persist middleware for auth state
- **Type Safety**: Comprehensive TypeScript coverage with strict mode
- **Component Library**: Shadcn/ui with Radix UI primitives for accessibility

## Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL | `http://localhost:3000/api/v1` |
| `NODE_ENV` | No | Environment mode (auto-set) | `development` or `production` |

### Security Configuration

The application implements multiple layers of security:

- **Token Management**: Access tokens stored in HTTP-only cookies and localStorage for cross-domain support
- **Automatic Refresh**: Token refresh logic prevents session interruption
- **CORS Handling**: Configured for cross-origin API requests
- **Input Validation**: Zod schemas validate all user inputs
- **Security Headers**: Implemented via Next.js configuration

## Development

### Available Scripts

```bash
npm run dev          # Start development server (port 4000)
npm run build        # Build for production with optimizations
npm run start        # Start production server
npm run lint         # Run ESLint for code quality
npm run test         # Run test suite (if configured)
```

### Development Workflow

**Code Quality Tools**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Code formatting (recommended for teams)
- **Error Boundaries**: React error boundaries for graceful degradation

**Best Practices**
- Follow the established folder structure
- Use TypeScript for all new files
- Implement error handling for all async operations
- Write meaningful commit messages
- Test role-based access before pushing

## Technology Stack

### Core Framework
- **Next.js 15**: React framework with App Router and server components
- **TypeScript 5**: Static typing and enhanced IDE support
- **React 18**: UI library with concurrent features

### Styling & UI
- **Tailwind CSS v4**: Utility-first CSS framework
- **Shadcn/ui**: Accessible component library
- **Radix UI**: Headless UI primitives
- **Framer Motion**: Animation library

### State & Data
- **Zustand**: Lightweight state management
- **React Hook Form**: Performant form handling
- **Zod**: Schema validation

### Developer Experience
- **Turbopack**: Fast bundler for development
- **ESLint**: Code linting
- **TypeScript**: Type safety

### Icons & Assets
- **Lucide React**: Icon library
- **Next.js Image**: Optimized image loading

## Deployment

### Vercel (Recommended)

Vercel provides the optimal hosting environment for Next.js applications:

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Import the project in Vercel dashboard
3. Configure environment variables in project settings
4. Deploy with automatic CI/CD

**Environment Variables in Vercel:**
```
NEXT_PUBLIC_API_URL=https://your-production-api.com/api/v1
```

### Docker Deployment

For containerized deployments:

**Build the image:**
```bash
docker build -t sms-web:latest .
```

**Run the container:**
```bash
docker run -p 4000:4000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1 \
  sms-web:latest
```

### Manual Deployment

For traditional hosting environments:

```bash
npm run build
npm run start
```

Ensure Node.js 18+ is available on the host server.

## Demo Access

To explore the application features, use the following demo credentials:

**Admin Account**
- Username: `admin-demo`
- Password: `Admin!123`
- Access: Full administrative privileges

**Note**: The backend API server must be running. Refer to the [sms-api repository](https://github.com/masabinhok/sms-api) for setup instructions.

## API Integration

This frontend application communicates with a separate backend API server. The API client (`lib/api-client.ts`) handles:

- Request/response interceptors
- Automatic token refresh
- Error handling and logging
- Cross-domain authentication

**Backend Repository**: [sms-api](https://github.com/masabinhok/sms-api)

## Documentation

Additional documentation and guides:

- [Database Integration Guide](./DATABASE_INTEGRATION_GUIDE.md) - Setup and schema information
- [API Documentation](https://github.com/masabinhok/sms-api) - Backend endpoints and contracts
- [Next.js Documentation](https://nextjs.org/docs) - Framework reference
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Language reference

## Contributing

We welcome contributions from the community. To contribute:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes with descriptive messages:
   ```bash
   git commit -m "Add: Implement feature X"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request with a detailed description

### Contribution Guidelines

- Follow the existing code style and patterns
- Ensure TypeScript types are properly defined
- Test your changes across different roles
- Update documentation for new features
- Keep commits focused and atomic

## Testing

The application includes a test suite using Vitest:

```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
```

Test files are located in the `__tests__/` directory, mirroring the source structure.

## Troubleshooting

### Common Issues

**Cannot connect to API**
- Verify the backend server is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is configured on the backend

**Authentication errors in production**
- Confirm cross-domain authentication is properly configured
- Check browser console for token-related errors
- Verify cookies and localStorage are accessible

**Build errors**
- Clear `.next` directory and node_modules
- Reinstall dependencies: `npm install`
- Check for TypeScript errors: `npm run lint`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

**Sabin Shrestha**

- Email: sabin.shrestha.er@gmail.com
- GitHub: [@masabinhok](https://github.com/masabinhok)
- Repository: [sms-web](https://github.com/masabinhok/sms-web)

## Support & Issues

For bug reports, feature requests, or questions:

- Open an issue on [GitHub Issues](https://github.com/masabinhok/sms-web/issues)
- Provide detailed steps to reproduce bugs
- Include environment information (Node version, OS, browser)

## Acknowledgments

Built with modern web technologies and best practices, this project leverages the open-source community's excellent tools and libraries. Special thanks to the Next.js, React, and TypeScript teams for their continued innovation.

## Project Status

**Version**: 1.0.0  
**Status**: Active Development  
**Last Updated**: November 2025

This project is actively maintained and welcomes contributions from the community.
