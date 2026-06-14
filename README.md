# RuangTulis

RuangTulis is a modern blog app built with Next.js, TypeScript, Tailwind CSS, and Prisma-ready PostgreSQL models.

## Features

- Public blog homepage with featured and latest articles
- Dynamic article detail pages
- Superadmin login gate for dashboard access
- Custom logout confirmation modal
- Dashboard for creating draft or published articles
- PostgreSQL post storage through Prisma
- Persistent view counts for published articles

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

Posts are stored in PostgreSQL through Prisma. `src/data/posts.json` is only used as the initial seed when the database has no posts yet.

After setting `DATABASE_URL`, prepare the database with:

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

For production deploys, run migrations with:

```bash
npm run db:deploy
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Vercel Deployment

Add these environment variables in Vercel Project Settings before deploying:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
ADMIN_USERNAME="superadmin"
ADMIN_PASSWORD="change-this-password"
DASHBOARD_ACCESS_KEY="change-this-to-a-long-random-value"
```

The build script runs `prisma generate` before `next build`, so the generated Prisma client does not need to be committed.

Before the first production deploy, run `npm run db:deploy` against the production database. Dashboard updates and article views will then persist in PostgreSQL instead of local files.

If you want Vercel to run migrations during deployment, set the Vercel Build Command to:

```bash
npm run build:production
```
