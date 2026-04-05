import { FastifyInstance } from "fastify";
import createProductRepository from "./products.repository.js";
import { createIPC } from "../../utils.js";
import type { Product } from "./products.types.js";
import {
  createProductsShema,
  getProductbyIDSchema,
} from "./products.schema.js";
import createProductsServiceWithIPC from "./products.serviceICP.js";

export default async function productRoutes(server: FastifyInstance) {
  const sendToMaster = server.clusterMode ? createIPC() : undefined;

  const repo = createProductRepository();
  const service = createProductsServiceWithIPC(repo, sendToMaster);

  server.get("/products", async () => {
    return await service.getProducts();
  });

  server.post<{ Body: Product }>(
    "/products",
    {
      schema: createProductsShema,
    },
    async (request, reply) => {
      const data = request.body;
      const created = await service.createProduct(data);
      console.log(created);
      return reply.status(201).send(created);
    },
  );

  server.get(
    "/products/:id",
    { schema: getProductbyIDSchema },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const product = await service.getProductById(id);

      if (!product) {
        reply.code(404).send({
          statusCode: 404,
          message: "Product not found",
          code: "NOT_FOUND",
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

      const product = await service.deleteProduct(id);

      if (!product) {
        reply.code(404).send({
          statusCode: 404,
          message: "Product not found",
          code: "NOT_FOUND",
        });
      }

      reply.code(204).send();
    },
  );

  server.put<{ Body: Product }>(
    "/products/:id",
    { schema: getProductbyIDSchema },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const data = request.body;

      const product = await service.updateProduct(id, data);

      if (!product) {
        reply.code(404).send({
          statusCode: 404,
          message: "Product not found",
          code: "NOT_FOUND",
        });
      }

      reply.code(200).send(product);
    },
  );
}
