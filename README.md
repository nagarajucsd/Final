# HR Management System

A comprehensive full-stack Human Resources Management System built with modern web technologies. This system provides complete HR functionality including employee management, attendance tracking, leave management, payroll processing, and real-time notifications.

## Features

### Core Functionality
- **User Authentication & Authorization**: JWT-based authentication with role-based access control (Admin, HR, Manager, Employee)
- **Multi-Factor Authentication (MFA)**: TOTP-based 2FA with recovery codes and email verification
- **Employee Management**: Complete CRUD operations for employee records with department assignments
- **Department Management**: Organize employees into departments with manager assignments
- **Attendance System**: 
  - Real-time clock in/out functionality
  - Automatic daily attendance record creation
  - Work hours calculation and tracking
  - Weekend and holiday handling
- **Leave Management**: 
  - Leave request submission and approval workflow
  - Multiple leave types support
  - Leave balance tracking
- **Payroll Processing**: Automated salary calculations and payroll record management
- **Task Management**: Assign and track tasks across teams
- **Notifications**: Real-time notification system with badge counters
- **Reports & Analytics**: Comprehensive reporting dashboard
- **Exit Interviews**: Structured exit interview process

### Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- Account lockout after failed login attempts
- MFA with TOTP (Time-based One-Time Password)
- Email verification for sensitive operations
- CAPTCHA verification for authentication flows
- Secure password reset functionality

## Tech Stack

### Frontend
- **React 19.2.0** - UI framework
- **TypeScript** - Type-safe development
- **Vite 6.2.0** - Build tool and dev server
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - Runtime environment
- **Express 4.18.2** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8.0.0** - MongoDB ODM

### Authentication & Security
- **jsonwebtoken 9.0.2** - JWT implementation
- **bcryptjs 2.4.3** - Password hashing
- **speakeasy 2.0.0** - TOTP/MFA implementation
- **express-validator 7.0.1** - Request validation

### Additional Tools
- **nodemailer 6.9.7** - Email service
- **qrcode 1.5.3** - QR code generation for MFA
- **multer 1.4.5** - File upload handling
- **cors 2.8.5** - Cross-origin resource sharing

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager

## Local Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd complete-hr-management-system
```

### 2. Install Dependencies

Install both frontend and backend dependencies:
```bash
npm run install:all
```

Or install separately:
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Configuration

#### Frontend Environment (.env)
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend Environment (server/.env)
Create a `.env` file in the `server` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/hr-management

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (for MFA and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=HR System <your-email@gmail.com>

# MFA Configuration
MFA_ISSUER=HR Management System
```

### 4. Database Setup

Ensure MongoDB is running locally:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

Seed the database with initial data (optional):
```bash
cd server
npm run seed
```

### 5. Run the Application

#### Development Mode (Both Frontend & Backend)
```bash
npm run dev:fullstack
```

#### Run Separately

Frontend (runs on http://localhost:5173):
```bash
npm run dev
```

Backend (runs on http://localhost:5000):
```bash
npm run server:dev
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## Build Commands

### Production Build

Build the frontend for production:
```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build
```bash
npm run preview
```

## Production Deployment

For detailed deployment instructions for your company, see:
- **[DEPLOYMENT_GUIDE_FOR_NEW_COMPANY.md](DEPLOYMENT_GUIDE_FOR_NEW_COMPANY.md)** - Complete guide for deploying to Vercel + Render
- **[docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)** - General deployment documentation

### Quick Deployment Summary

**What You Need:**
- MongoDB Atlas account (database)
- Render account (backend hosting)
- Vercel account (frontend hosting)

**Configuration Files to Update:**
1. `server/.env.production` - Backend environment variables
2. `.env.production` - Frontend environment variables
3. `render.yaml` - Render deployment configuration

**Key Changes Required:**
- Update `MONGODB_URI` with your MongoDB connection string
- Update `FRONTEND_URL` with your Vercel URL
- Update `VITE_API_URL` with your Render backend URL
- Change `MFA_ISSUER` to your company name

See **DEPLOYMENT_GUIDE_FOR_NEW_COMPANY.md** for step-by-step instructions.

## Default Credentials

After seeding the database, use these credentials:

**Admin Account:**
- Email: admin@company.com
- Password: admin123

**HR Account:**
- Email: hr@company.com
- Password: hr123

**Manager Account:**
- Email: manager@company.com
- Password: manager123

**Employee Account:**
- Email: employee@company.com
- Password: employee123

> **Important**: Change these credentials immediately after first login in production.

## Project Structure

```
complete-hr-management-system/
├── client/                 # Frontend source files (if separated)
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components (Sidebar, Topbar)
│   ├── leave/            # Leave management components
│   ├── mfa/              # MFA components
│   └── pages/            # Page components
├── server/               # Backend application
│   ├── config/          # Configuration files
│   ├── jobs/            # Scheduled jobs (attendance automation)
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   └── utils/           # Helper functions
├── services/            # Frontend services
├── utils/               # Frontend utilities
├── docs/                # Documentation
├── .env                 # Frontend environment variables
├── server/.env          # Backend environment variables
└── package.json         # Project dependencies
```

## API Documentation

See [docs/API_REFERENCE.md](docs/API_REFERENCE.md) for complete API documentation.

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common deployment and runtime issues.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed system architecture.

## Database Schema

See [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for database structure and relationships.

## Deployment Guide

See [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for step-by-step deployment instructions.

## Support

For issues and questions:
1. Check the troubleshooting guide
2. Review the API documentation
3. Check application logs for error details

## License

Proprietary - All rights reserved
