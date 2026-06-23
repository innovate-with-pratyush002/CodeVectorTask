import { getProducts } from "../services/productsService.js";

export async function listProducts(request, response, next) {
  try {
    const { limit, cursor, category } = request.query;
    const result = await getProducts({ limit, cursor, category });

    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
