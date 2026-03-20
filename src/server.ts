import fastify from "fastify";

export function buildServer(cluster = false) {
  const server = fastify();

  server.decorate("clusterMode", cluster);

  server.register(import("./features/products/products.routes.js"), {
    prefix: "/api",
  });

  return server;
}

export async function startServer(port: number, cluster = false) {
  const server = buildServer(cluster);

  try {
    await server.listen({ port });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

// export default async function startServer(port: number, cluster = false) {
//   const server = fastify();

//   server.decorate("clusterMode", cluster);

//   server.register(import("./features/products/products.routes.js"), {
//     prefix: "/api",
//   });

//   try {
//     await server.listen({ port });
//     return server;
//   } catch (err) {
//     server.log.error(err);
//     process.exit(1);
//   }
// }
