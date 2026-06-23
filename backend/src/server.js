import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import productsRoutes from "./routes/productsRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl
  })
);
app.use(express.json());

app.get("/api/health", (request, response) => {
  response.status(200).json({ message: "Backend is running." });
});

app.use("/api/products", productsRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server is running on http://localhost:${env.port}`);
});
