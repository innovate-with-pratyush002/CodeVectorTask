# Project Knowledge Summary

## Goal

Build a simple, production-ready product browsing app that can handle around 200,000 products without duplicate or missing items during pagination.

## Major Design Decisions

### 1. Cursor pagination instead of offset pagination

We will not use `LIMIT ... OFFSET ...`.

Reason:

- Offset becomes slower as the table grows because PostgreSQL still has to walk past earlier rows.
- Offset can return duplicate or missing products if new rows are inserted while the user is browsing.

We will use keyset pagination with:

- `created_at DESC`
- `id DESC`

This means every page asks for items "after the last item from the previous page" instead of "skip N rows".

### 2. Composite cursor using `created_at` and `id`

`created_at` alone is not enough because multiple rows can share the same timestamp.

So the cursor will store:

- `createdAt`
- `id`

This gives a stable order:

1. Newer products first
2. If two products have the same timestamp, the product with the larger `id` in descending order comes first

This prevents unstable ordering and helps avoid duplicates or skipped rows.

### 3. Database indexes for performance

We will add:

- A composite index on `(created_at DESC, id DESC)`
- An index on `category`

Reason:

- The composite index helps PostgreSQL quickly fetch the next page in the same order used by the API.
- The category index helps filtering by category.

This keeps reads fast even as data grows.

### 4. Simple backend structure

The backend will use a beginner-friendly layered structure:

- `routes` for HTTP endpoints
- `controllers` for request and response handling
- `services` for pagination and query logic
- `config` for shared setup like Prisma
- `middleware` for error handling

This keeps logic organized without introducing complicated patterns.

### 5. Seed script with batch inserts

We need 200,000 products, so the seed script will:

- generate realistic product names and prices
- insert data in batches
- use Prisma `createMany`

Reason:

- inserting one row at a time would be slow
- batch inserts are much better for large seed jobs

### 6. Frontend keeps pagination simple

The frontend will:

- load the first page
- support category changes
- load the next page using `nextCursor`
- append results without refetching previous pages

Reason:

- this mirrors how cursor pagination is meant to be used
- the UI stays easy to explain in an interview

### 7. API response shape

`GET /api/products` will return:

- `products`
- `nextCursor`
- `hasMore`

Reason:

- the response is easy to consume on the frontend
- it clearly tells the client whether another request is needed

### 8. Deployment-friendly environment setup

The project will be prepared for:

- Render for backend/frontend hosting
- Neon PostgreSQL for the database

We will include:

- `.env.example`
- Prisma setup
- scripts for development, build, and seed

## Interview-Friendly Explanation

If asked why this design is good:

- It is correct because cursor pagination avoids duplicate and missing records during inserts.
- It is fast because the query order matches the database index.
- It is scalable because keyset pagination does not degrade like offset pagination.
- It is simple because the code uses standard Express, Prisma, and React patterns without overengineering.
