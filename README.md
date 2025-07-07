This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Main Features & Requirements

This system is composed of three core components: Mobile View (User Interface), Admin Portal, and a Backend API service. Each component includes essential features required to support user registration, digital ID card management, QR code sharing, and administrative control.
📱 Mobile View (User Interface)

    Tech Stack: Next.js, React Hook Form, Zustand, TanStack Query, Axios

## Features:

    User Registration & Login (JWT Auth)

    Mobile-optimized Digital ID Card View

    Display user details: full name job title, company, phone, email, links

    Share via generated QR Code or public URL

    Real-time data sync with backend

## Requirements:

    Fully responsive design for mobile browsers

    Server-side rendering for SEO optimization (optional)

    Secure token-based session handling

    User-friendly interface and form validation

## Admin Portal (Dashboard)

    Tech Stack: React.js, Zustand, Axios Interceptors, React Hook Form

## Features:

    Admin-only login with role-based access control

    View and manage registered users

    Create / Edit / Delete user accounts

    Activate or deactivate digital ID cards

    Dashboard view with total users and activity metrics

## Requirements:

    Protected routes using admin authentication

    Clean UI/UX with filters, search, and table views

    Action confirmation modals (e.g., delete or deactivate)

    Analytics panel for high-level overview

## Backend API Service

    Tech Stack: Express.js (TypeScript), PostgreSQL, TypeORM, JWT

## Features:

    RESTful API for authentication & user management

    JWT token generation and role-based route protection

    CRUD operations for users and card data

    QR code and public URL generation

    Log actions and store admin operations

## Requirements:

    Secure JWT-based auth middleware

    Database schema with users, roles, logs, settings

    Input validation, error handling, and status codes

    Environment-based configuration (.env)

    PostgreSQL setup with TypeORM and migrations
