import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL || "",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173"
};
