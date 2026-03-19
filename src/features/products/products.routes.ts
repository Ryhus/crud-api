import { FastifyInstance } from "fastify";
import createProductRepository from "./products.repository.js";
import { createIPC } from "@/utils.js";
import type { Product } from "./products.types.js";
import {
  createProductsShema,
  getProductbyIDSchema,
} from "./products.schema.js";
import createProductsServiceWithIPC from "./products.serviceICP.js";

export default async function productRoutes(server: FastifyInstance) {
  const { sendToMaster } = createIPC();
  const repo = createProductRepository();
  const service = createProductsServiceWithIPC(repo, sendToMaster);

  server.get("/products", async () => {
    return service.getProducts();
  });

  server.post<{ Body: Product }>(
    "/products",
    {
      schema: createProductsShema,
    },
    async (request, reply) => {
      const data = request.body;
      const created = service.createProduct(data);
      return reply.status(201).send(created);
    },
  );

  server.get(
    "/products/:id",
    { schema: getProductbyIDSchema },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const product = service.getProductById(id);

      if (!product) {
        reply.code(404).send({
          error: "Not found",
          message: "Product not found",
          statusCode: 404,
        });
      }

      return product;
    },
  );

  server.delete(
    "/products/:id",
    { schema: getProductbyIDSchema },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const product = service.deleteProduct(id);

      if (!product) {
        reply.code(404).send({
          error: "Not found",
          message: "Product not found",
          statusCode: 404,
        });
      }

      reply.code(204).send();
    },
  );

  server.put<{ Body: Product }>(
    "/products/:id",
    { schema: getProductbyIDSchema },
    (request, reply) => {
      const { id } = request.params as { id: string };
      const data = request.body;

      const product = service.updateProduct(id, data);

      if (!product) {
        reply.code(404).send({
          error: "Not found",
          message: "Product not found",
          statusCode: 404,
        });
      }

      reply.code(200).send(product);
    },
  );
}
