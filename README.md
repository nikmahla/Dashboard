# Admin Dashboard

A modern admin dashboard built with Next.js, React, Tailwind CSS, and Recharts. It includes authenticated admin routes, server API endpoints, interactive tables, charts, optimistic UI updates, and a refined dashboard experience.

GitHub: https://github.com/nikmahla/Dashboard

## Live Demo

https://dashboard-256xacra2-mahs-projects-ddae92ec.vercel.app

> Note: The admin dashboard is protected and requires authentication for `/admin` pages.

## Features

- Next.js 16 App Router with server and client components
- React 19.2.1 and Tailwind CSS v4
- Recharts-based KPI and inventory charts
- React Query for data fetching, caching, and optimistic updates
- API routes for auth, customers, inventory, orders, products, tasks, and users
- Authentication flows with login, logout, and protected admin pages
- Accessible modal dialogs, forms, tables, and dashboard components
- Jest + Testing Library test coverage for key components and auth routes

## Tech Stack

- Next.js 16.0.10
- React 19.2.1
- Tailwind CSS v4
- Recharts
- @tanstack/react-query
- Jest + Testing Library
- Vercel deployment

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server after build
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm test -- --runInBand <file>` - Run specific test files

## Testing

Run all tests:

```bash
npm test
```

Run targeted tests:

```bash
npm test -- --runInBand src/components/__tests__/KpiCard.test.tsx
```

## Deployment

Recommended deployment platform: Vercel.

### Deploy on Vercel

1. Connect the GitHub repository to Vercel.
2. Set the framework to **Next.js**.
3. Use:
   - Build command: `npm run build`
   - Output directory: `.next`
4. Deploy.

### Local production build

```bash
npm run build
```

## Notes

- If dependency installation fails due to peer conflicts, the repository includes a `.npmrc` setting for `legacy-peer-deps=true`.
- The `/admin` routes require an authenticated session.

## Contributing

Contributions are welcome. If you want to improve the dashboard, please:

1. Fork the repository.
2. Create a feature branch.
3. Open a pull request with a clear summary of your changes.

