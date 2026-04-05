import type { Product } from "./products.types.js";

export default function createProductRepository() {
  const products: Product[] = [];

  return {
    findAll() {
      return products;
    },

    findByID(id: string) {
      return products.find((product) => product.id === id);
    },

    create(product: Product) {
      products.push(product);
      return product;
    },

    delete(id: string) {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return;
      const [deleted] = products.splice(index, 1);

      return deleted;
    },

    update(product: Product) {
      const index = products.findIndex((p) => p.id === product.id);
      if (index === -1) return;
      products[index] = product;
      return product;
    },
  };
}
