import fastify from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    clusterMode: boolean;
  }
}
