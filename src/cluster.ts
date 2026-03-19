import "dotenv/config";
import startServer from "./server.js";
import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import fastify from "fastify";
import type { Product } from "./features/products/products.types.js";

const PORT = Number(process.env.PORT) || 4000;

let workerPort = PORT + 1;
const numWorkers = availableParallelism() - 1;
const workerPorts: number[] = [];
const products: Product[] = [];

if (cluster.isPrimary) {
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork({ PORT: workerPort });
    workerPorts.push(workerPort);
    workerPort += 1;
  }

  const lb = fastify();
  let current = 0;

  lb.all("/api/*", async (req, reply) => {
    const targetPort = workerPorts[current];
    current = (current + 1) % workerPorts.length;
    console.log(req.headers);

    const res = await fetch(`http://localhost:${targetPort}${req.url}`, {
      method: req.method,
      headers: {
        "content-type": req.headers["content-type"] || "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await res.text();

    reply.status(res.status).send(data);
  });

  lb.listen({ port: PORT }, () => {});

  cluster.on("message", (worker, msg) => {
    if (!msg?.requestId) return;

    const respond = (data: unknown) => {
      worker.send({ requestId: msg.requestId, data });
    };

    switch (msg.type) {
      case "CREATE":
        products.push(msg.payload as Product);
        respond(msg.payload);
        break;

      case "GET":
        respond(products);
        break;

      case "GET_BY_ID":
        respond(products.find((p) => p.id === msg.payload.id) || null);
        break;

      case "UPDATE":
        const idx = products.findIndex((p) => p.id === msg.payload.id);
        if (idx !== -1) {
          products[idx] = {
            ...products[idx],
            ...(msg.payload.update as Partial<Product>),
          };
          respond(products[idx]);
        } else {
          respond(null);
        }
        break;

      case "DELETE":
        const delIdx = products.findIndex((p) => p.id === msg.payload.id);
        if (delIdx !== -1) {
          const [deleted] = products.splice(delIdx, 1);
          respond(deleted);
        } else {
          respond(null);
        }
        break;
    }
  });
} else {
  const WORKER_PORT = Number(process.env.PORT);
  startServer(WORKER_PORT);
}
