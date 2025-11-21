# 🎓 School Management System - Web Application

A modern, full-featured School Management System built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

- 🔐 **Multi-role Authentication** - Admin, Teacher, Student, and Super Admin roles
- 📊 **Comprehensive Dashboards** - Role-specific views and analytics
- 👥 **User Management** - Student, teacher, and admin profile management
- 📚 **Academic Management** - Classes, subjects, and assignments
- 🎯 **Attendance Tracking** - Real-time attendance monitoring
- 📈 **Grade Management** - Assignment grading and report cards
- 💬 **Messaging System** - Internal communication platform
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🔒 **Security First** - JWT authentication, secure headers, input validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API server running (see [sms-api](https://github.com/masabinhok/sms-api))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/masabinhok/sms-web.git
cd sms-web
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and configure:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000  # Your backend API URL
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) in your browser.

## 📁 Project Structure

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
└── hooks/                # Custom React hooks
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | Backend API URL |
| `NODE_ENV` | No | Environment (auto-set by hosting) |

### Security Features

- ✅ HTTP-only cookies for tokens
- ✅ Automatic token refresh
- ✅ CSRF protection
- ✅ Security headers (HSTS, CSP, etc.)
- ✅ Input validation with Zod
- ✅ XSS prevention

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server (port 4000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting (recommended)
- **Error Boundaries** for graceful error handling

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Docker

```bash
# Build
docker build -t sms-web .

# Run
docker run -p 4000:4000 -e NEXT_PUBLIC_API_URL=your-api-url sms-web
```

### Environment-specific configs

- Development: Uses `.env.local`
- Production: Set variables in hosting platform

## 🔐 Demo Credentials

**Note**: Backend server must be running. See [sms-api](https://github.com/masabinhok/sms-api) repository.

- Username: `admin-demo`
- Password: `Admin!123`
- Role: Admin

## 📚 Documentation

- [Database Integration Guide](./DATABASE_INTEGRATION_GUIDE.md)
- [API Documentation](https://github.com/masabinhok/sms-api)
- [Next.js Docs](https://nextjs.org/docs)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Sabin Shrestha**
- Email: sabin.shrestha.er@gmail.com
- GitHub: [@masabinhok](https://github.com/masabinhok)

## 🐛 Issues

Found a bug? Please [open an issue](https://github.com/masabinhok/sms-web/issues).

## ⭐ Support

If you find this project helpful, please give it a star on GitHub!
