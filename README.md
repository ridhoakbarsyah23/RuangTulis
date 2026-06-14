# RuangTulis

RuangTulis is a modern blog app built with Next.js, TypeScript, Tailwind CSS, and Prisma-ready PostgreSQL models.

## Features

- Public blog homepage with featured and latest articles
- Dynamic article detail pages
- Superadmin login gate for dashboard access
- Custom logout confirmation modal
- Dashboard for creating draft or published articles
- Local JSON post storage for fast development
- Prisma schema prepared for PostgreSQL migration

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL-ready schema

## Getting Started

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Run the development server:

```bash
npm run dev:3001
```

Open:

```txt
http://localhost:3001
```

## Admin Access

Set the dashboard credentials in `.env`:

```env
ADMIN_USERNAME="superadmin"
ADMIN_PASSWORD="admin123"
DASHBOARD_ACCESS_KEY="change-this-to-a-long-random-value"
```

Dashboard route:

```txt
http://localhost:3001/dashboard
```

## Database

The current app stores posts in `src/data/posts.json`.

Prisma is already configured for a future PostgreSQL migration. After setting `DATABASE_URL`, use:

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Quality Checks

```bash
npm run lint
npm run build
```
