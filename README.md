# CodeVectorTask

Production-ready internship submission for browsing a large product catalog with correct, scalable pagination.

## Problem Statement

Build a backend that can browse around `200,000` products while supporting:

- newest products first
- category filtering
- pagination
- correct pagination even when new products are inserted during browsing
- no duplicate products
- no missing products

## Tech Stack

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

### Frontend

- React
- Vite

### Deployment Target

- Render
- Neon PostgreSQL

## Key Engineering Decision

This project uses **cursor-based pagination** and intentionally does **not** use offset pagination.

Offset pagination like `LIMIT 20 OFFSET 40` has two major problems:

1. It becomes slower as the table grows.
2. It can show duplicate or missing rows if new products are inserted between page requests.

To avoid that, the API sorts by:

- `created_at DESC`
- `id DESC`

The cursor contains both `createdAt` and `id`, which gives stable ordering even when two rows share the same timestamp.

## Why This Works

When the user opens the next page, the backend asks for rows that come **after the last row of the previous page** in the sorted order.

That means:

- rows with an older `created_at`
- or rows with the same `created_at` and a smaller `id`

This makes pagination:

- fast
- stable
- safe for growing datasets

## Features

- Stable cursor pagination
- Category filtering
- Newest products first
- Batch seed script for `200,000` products
- Simple React UI for browsing and loading more products
- Interview-friendly code structure and comments

## Project Structure

```text
CodeVectorTask/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
├── IMPLEMENTATION_PLAN.md
├── PROJECT_KNOWLEDGE_SUMMARY.md
└── README.md
```

## Database Design

### Product fields

- `id`
- `name`
- `category`
- `price`
- `created_at`
- `updated_at`

### Indexes

- composite index on `(created_at DESC, id DESC)`
- index on `category`

Why these indexes matter:

- the composite index supports fast cursor pagination in the same order used by the API
- the category index supports faster filtered reads

## API

### `GET /api/products`

Query params:

- `limit`
- `cursor`
- `category`

Example requests:

```text
/api/products
/api/products?limit=20
/api/products?cursor=...
/api/products?category=Electronics
/api/products?category=Electronics&cursor=...
```

Example response:

```json
{
  "products": [
    {
      "id": "70f774f1-cdac-4e80-9f69-4fa1b27ac96d",
      "name": "Premium Doll 2108",
      "category": "Toys",
      "price": 916.58,
      "createdAt": "2026-06-23T13:11:05.386Z",
      "updatedAt": "2026-06-23T13:11:05.386Z"
    }
  ],
  "nextCursor": "encoded-cursor-value",
  "hasMore": true
}
```

### `GET /api/health`

Simple health check endpoint.

## Seed Strategy

The seed script creates `200,000` products using Prisma `createMany` in batches of `5,000`.

Why this approach is used:

- much faster than inserting one row at a time
- simple to explain in an interview
- suitable for large seed jobs

Generated data includes:

- realistic categories
- realistic product names
- varied prices

## Local Setup

### 1. Clone and open the project

```bash
cd CodeVectorTask
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Set these values in `.env`:

- `DATABASE_URL`
- `PORT`
- `FRONTEND_URL`

Then run:

```bash
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

Backend default URL:

```text
http://localhost:5000
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Set this value in `.env`:

- `VITE_API_BASE_URL`

Then run:

```bash
npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

## How To Verify

### Backend checks

Health check:

```bash
curl http://localhost:5000/api/health
```

First page:

```bash
curl "http://localhost:5000/api/products?limit=3"
```

Filtered page:

```bash
curl "http://localhost:5000/api/products?limit=3&category=Electronics"
```

Next page:

Use the `nextCursor` from the previous response:

```bash
curl "http://localhost:5000/api/products?limit=3&category=Electronics&cursor=YOUR_CURSOR"
```

### Frontend checks

- page loads successfully
- products appear in newest-first order
- category filter changes the result set
- clicking `Load More` appends the next page

## Submission Notes

This project was written to be:

- simple
- clean
- scalable
- easy to explain in an interview

It avoids overengineering on purpose. The main focus is solving the pagination correctness problem with a production-friendly but beginner-friendly design.

## Interview Explanation Summary

If asked to explain the project quickly:

1. The main challenge is correct pagination while new rows are being inserted.
2. Offset pagination can miss or repeat rows, so I used cursor pagination.
3. I sorted by `created_at DESC, id DESC` and used both values in the cursor.
4. I added matching database indexes so the query stays fast at scale.
5. I seeded `200,000` products in batches using Prisma `createMany`.

## Deployment Notes

### Backend on Render

- create a new Render web service
- set the root directory to `backend`
- build command: `npm install && npm run prisma:generate`
- start command: `npm start`
- add environment variables from `backend/.env`

### Database on Neon

- create a PostgreSQL database on Neon
- copy the connection string into `DATABASE_URL`
- run `npm run db:push`
- run `npm run db:seed`

### Frontend on Render

- create a static site or web service for `frontend`
- set `VITE_API_BASE_URL` to the deployed backend URL

## Important Files

- [README.md](/home/pratyush/Development/GitHub/CodeVector/CodeVectorTask/README.md)
- [IMPLEMENTATION_PLAN.md](/home/pratyush/Development/GitHub/CodeVector/CodeVectorTask/IMPLEMENTATION_PLAN.md)
- [PROJECT_KNOWLEDGE_SUMMARY.md](/home/pratyush/Development/GitHub/CodeVector/CodeVectorTask/PROJECT_KNOWLEDGE_SUMMARY.md)
- [schema.prisma](/home/pratyush/Development/GitHub/CodeVector/CodeVectorTask/backend/prisma/schema.prisma)
- [seed.js](/home/pratyush/Development/GitHub/CodeVector/CodeVectorTask/backend/prisma/seed.js)
- [productsService.js](/home/pratyush/Development/GitHub/CodeVector/CodeVectorTask/backend/src/services/productsService.js)
