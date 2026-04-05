import type { Product, ProductsRepo } from "./products.types.js";
import { randomUUID } from "node:crypto";
import createProductsService from "./products.service.js";

export default function createProductsServiceWithIPC(
  repo: ProductsRepo,
  sendToMaster?: <T>(type: string, payload: unknown) => Promise<T>,
) {
  const service = createProductsService(repo);

  if (!sendToMaster) return service;

  return {
    getProducts() {
      return sendToMaster<Product[]>("GET", {});
    },

    createProduct(product: Product) {
      product.id = randomUUID();
      return sendToMaster<Product>("CREATE", product);
    },

    getProductById(id: string) {
      return sendToMaster<Product | null>("GET_BY_ID", { id });
    },

    deleteProduct(id: string) {
      return sendToMaster<Product | null>("DELETE", { id });
    },

    updateProduct(id: string, data: Partial<Product>) {
      return sendToMaster<Product | null>("UPDATE", { id, update: data });
    },
  };
}
