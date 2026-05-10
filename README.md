# Planzo Travel Planner

A travel planning app built with Next.js 16, React 19, Tailwind CSS 4, and PostgreSQL.

## Overview

Planzo helps users plan multi-city trips with stops, activity budgets, packing lists, and trip notes.

The app includes:

- user sign up / sign in
- city browsing from `/api/cities`
- trip creation and dashboard summary
- ordered stops with arrival/departure dates
- activity tracking and costs per stop
- packing list items per trip
- trip notes for planning details
- public trip view via `/trips/public/[slug]`

## Local Setup

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

Then visit `http://localhost:3000`.

## Live Demo

Check the deployed app here:

- https://planzo-zeta.vercel.app/

## Test Account

Use this account to sign in quickly during testing:

- Email: `test@test.com`
- Password: `test`

> The account requires a matching `users` record in the connected PostgreSQL database.

## Authentication

Available frontend pages:

- `/auth/login` — sign in
- `/auth/signup` — create a new account
- `/dashboard` — user dashboard after login

Login state is stored in browser `localStorage` under the key `traveloop_user`.

## Database Configuration

This app uses PostgreSQL through `lib/db.js`.

Create a `.env.local` file with:

```env
DB_URL=postgres://user:password@host:port/database
```

## Expected Database Tables

The API assumes these tables exist:

- `users`
- `cities`
- `trips`
- `stops`
- `activities`
- `packing_items`
- `trip_notes`

## Key API Endpoints

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/cities`
- `GET /api/trips?userId=...`
- `POST /api/trips`
- `POST /api/stops`
- `POST /api/activities`
- `GET /api/packing?tripId=...`
- `POST /api/packing`
- `GET /api/notes?tripId=...`
- `POST /api/notes`
- `GET /api/trips/public/[slug]`

## App Pages

- `/` — landing page with city preview and features
- `/auth/login` — login page
- `/auth/signup` — signup page
- `/dashboard` — authenticated dashboard
- `/trips` — trip list
- `/trips/create` — create a new trip

## Notes

The app currently expects a PostgreSQL database connection and uses server-side API routes to read/write travel data.

If you want to test with the provided credentials, seed `users` with `test@test.com` / `test` and add any related trips or city records.
