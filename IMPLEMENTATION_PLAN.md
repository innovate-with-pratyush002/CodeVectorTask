# Implementation Plan

## Phase 1. Project setup

1. Create `backend/` and `frontend/` folders.
2. Add clean `package.json` files for both apps.
3. Add `.gitignore` and `.env.example`.
4. Keep the structure simple and easy to explain.

## Phase 2. Backend foundation

1. Configure Express server.
2. Add shared Prisma client setup.
3. Add health route and product route skeleton.
4. Add error handling middleware.

Deliverable:

- backend starts correctly
- API structure is ready for product queries

## Phase 3. Database schema and indexing

1. Create Prisma schema for `Product`.
2. Use UUID `id`.
3. Add `name`, `category`, `price`, `created_at`, and `updated_at`.
4. Add composite index for pagination order.
5. Add category index for filtering.

Deliverable:

- schema supports stable sorting and filtering

## Phase 4. Cursor pagination logic

1. Define supported query params:
   - `limit`
   - `cursor`
   - `category`
2. Encode the cursor as a safe string for transport.
3. Decode the cursor in the backend.
4. Query products ordered by:
   - `created_at DESC`
   - `id DESC`
5. Build a correct "next page" condition:
   - rows with earlier `created_at`
   - or same `created_at` and smaller `id`
6. Fetch `limit + 1` rows to determine `hasMore`.
7. Return `nextCursor` from the last visible row.

Deliverable:

- stable pagination with no duplicates and no missing rows

## Phase 5. Seed script

1. Generate realistic categories.
2. Generate product names from adjective + category/item patterns.
3. Generate prices in sensible ranges.
4. Insert 200,000 products in batches using Prisma `createMany`.
5. Print progress so the user can see the seed status.

Deliverable:

- fast seed flow suitable for Neon/PostgreSQL

## Phase 6. Frontend UI

1. Create a simple page with:
   - title
   - category filter
   - product grid/list
   - load more button
2. Add loading, empty, and error states.
3. Fetch the first page on load.
4. Reset pagination when the category changes.
5. Append more products using `nextCursor`.

Deliverable:

- usable UI that demonstrates backend correctness clearly

## Phase 7. Documentation

1. Update root README with setup instructions.
2. Explain why cursor pagination is used.
3. Explain how to run migrations, seed data, backend, and frontend.
4. Add deployment notes for Render and Neon.

Deliverable:

- recruiter/interviewer-friendly project documentation

## Phase 8. Final review

1. Check folder structure.
2. Review naming and comments.
3. Make sure logic is simple enough to explain in an interview.
4. Verify there is no unnecessary abstraction.

## Key Assumptions

- Prisma will manage the PostgreSQL connection through `DATABASE_URL`.
- The backend will expose APIs under `/api`.
- The frontend will read the backend base URL from a Vite environment variable.
- Price will be stored with Prisma `Decimal` for database correctness and converted safely in API responses.

## Risks and How We Handle Them

### Same timestamp values

Handled by using `id` as the second sort key.

### Large inserts during browsing

Handled by cursor pagination instead of offset pagination.

### Large seed volume

Handled by batch inserts with `createMany`.

### Frontend duplicate rendering

Handled by appending only the next page returned by the backend and resetting state on filter change.
