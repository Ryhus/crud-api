import "dotenv/config";
import fastify from "fastify";

const PORT = Number(process.env.PORT) || 4000;

const server = fastify();

server.register(import("./features/products/products.routes.js"), {
  prefix: "/api",
});

async function startServer() {
  try {
    await server.listen({ port: PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

startServer();
