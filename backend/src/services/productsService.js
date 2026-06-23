import prisma from "../config/prisma.js";
import { decodeCursor, encodeCursor } from "../utils/cursor.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function normalizeLimit(limitValue) {
  const parsedLimit = Number(limitValue);

  if (!parsedLimit || Number.isNaN(parsedLimit)) {
    return DEFAULT_LIMIT;
  }

  return Math.min(Math.max(parsedLimit, 1), MAX_LIMIT);
}

function buildPaginationFilter(cursor) {
  if (!cursor) {
    return {};
  }

  // For descending order, the next page must contain "older" rows.
  // That means:
  // 1. smaller createdAt values
  // 2. or same createdAt and a smaller id value
  return {
    OR: [
      {
        createdAt: {
          lt: cursor.createdAt
        }
      },
      {
        createdAt: cursor.createdAt,
        id: {
          lt: cursor.id
        }
      }
    ]
  };
}

function buildWhereClause(category, cursor) {
  const filters = [];

  if (category) {
    filters.push({ category });
  }

  const paginationFilter = buildPaginationFilter(cursor);

  if (Object.keys(paginationFilter).length > 0) {
    filters.push(paginationFilter);
  }

  if (filters.length === 0) {
    return {};
  }

  if (filters.length === 1) {
    return filters[0];
  }

  return {
    AND: filters
  };
}

function serializeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
}

export async function getProducts({ limit, cursor, category }) {
  const normalizedLimit = normalizeLimit(limit);
  const decodedCursor = cursor ? decodeCursor(cursor) : null;

  const products = await prisma.product.findMany({
    where: buildWhereClause(category, decodedCursor),
    orderBy: [
      { createdAt: "desc" },
      { id: "desc" }
    ],
    take: normalizedLimit + 1
  });

  const hasMore = products.length > normalizedLimit;
  const visibleProducts = hasMore ? products.slice(0, normalizedLimit) : products;
  const lastVisibleProduct = visibleProducts[visibleProducts.length - 1];

  return {
    products: visibleProducts.map(serializeProduct),
    nextCursor: hasMore && lastVisibleProduct ? encodeCursor(lastVisibleProduct) : null,
    hasMore
  };
}
