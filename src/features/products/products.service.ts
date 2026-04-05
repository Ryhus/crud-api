import { randomUUID } from "node:crypto";
import type { ProductsRepo, Product } from "./products.types.js";

export default function createProductsService(repo: ProductsRepo) {
  return {
    getProducts() {
      return repo.findAll();
    },

    createProduct(product: Product) {
      product.id = randomUUID();
      return repo.create(product);
    },

    getProductById(id: string) {
      return repo.findByID(id);
    },

    deleteProduct(id: string) {
      return repo.delete(id);
    },

    updateProduct(id: string, data: Partial<Product>) {
      const product = repo.findByID(id);
      if (!product) return;
      const updated = { ...product, ...data };
      return repo.update(updated);
    },
  };
}
