import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 5000;

const categories = [
  "Electronics",
  "Fashion",
  "Books",
  "Sports",
  "Home",
  "Food",
  "Beauty",
  "Toys"
];

const categoryItems = {
  Electronics: ["Laptop", "Headphones", "Smartphone", "Camera", "Tablet", "Monitor"],
  Fashion: ["Jacket", "Sneakers", "T-Shirt", "Backpack", "Watch", "Jeans"],
  Books: ["Novel", "Workbook", "Guide", "Dictionary", "Biography", "Handbook"],
  Sports: ["Football", "Cricket Bat", "Yoga Mat", "Running Shoes", "Dumbbell", "Helmet"],
  Home: ["Chair", "Lamp", "Curtain", "Table", "Cookware Set", "Storage Box"],
  Food: ["Snack Pack", "Coffee Beans", "Protein Bar", "Tea Box", "Dry Fruits", "Chocolate Mix"],
  Beauty: ["Face Wash", "Shampoo", "Serum", "Lip Balm", "Moisturizer", "Sunscreen"],
  Toys: ["Puzzle Set", "Building Blocks", "Toy Car", "Board Game", "Action Figure", "Doll"]
};

const namePrefixes = [
  "Premium",
  "Classic",
  "Smart",
  "Eco",
  "Ultra",
  "Compact",
  "Modern",
  "Everyday",
  "Pro",
  "Elite"
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function generateProductName(category) {
  const prefix = randomItem(namePrefixes);
  const item = randomItem(categoryItems[category]);
  const serial = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix} ${item} ${serial}`;
}

function generatePrice(category) {
  const ranges = {
    Electronics: [1999, 89999],
    Fashion: [499, 7999],
    Books: [149, 1499],
    Sports: [299, 9999],
    Home: [399, 19999],
    Food: [99, 1999],
    Beauty: [149, 3499],
    Toys: [199, 4999]
  };

  const [min, max] = ranges[category];
  const value = Math.random() * (max - min) + min;
  return value.toFixed(2);
}

function generateBatch(batchNumber, batchSize) {
  const batch = [];
  const now = Date.now();

  for (let index = 0; index < batchSize; index += 1) {
    const category = randomItem(categories);
    const createdAt = new Date(now - ((batchNumber * batchSize + index) * 1000));

    batch.push({
      name: generateProductName(category),
      category,
      price: generatePrice(category),
      createdAt,
      updatedAt: createdAt
    });
  }

  return batch;
}

async function main() {
  console.log("Clearing old products...");
  await prisma.product.deleteMany();

  const totalBatches = Math.ceil(TOTAL_PRODUCTS / BATCH_SIZE);
  let insertedCount = 0;

  for (let batchNumber = 0; batchNumber < totalBatches; batchNumber += 1) {
    const remaining = TOTAL_PRODUCTS - (batchNumber * BATCH_SIZE);
    const currentBatchSize = Math.min(BATCH_SIZE, remaining);
    const data = generateBatch(batchNumber, currentBatchSize);

    await prisma.product.createMany({ data });
    insertedCount += currentBatchSize;

    console.log(
      `Inserted batch ${batchNumber + 1}/${totalBatches} (${insertedCount}/${TOTAL_PRODUCTS} products)`
    );
  }

  console.log(`Finished seeding ${TOTAL_PRODUCTS} products.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
