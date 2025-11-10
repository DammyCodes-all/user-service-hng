import fastify from "fastify";
import dotenv from "dotenv";
import { AuthRoutes } from "./routes/auth-routes";
import { UserRoutes } from "./routes/user-routes";
import { PrismaClient } from "@/generated/prisma/client";
dotenv.config();
const app = fastify({ logger: true });
const port = process.env.PORT! ? parseInt(process.env.PORT) : 8000;

app.register(AuthRoutes, { prefix: "/auth" });
app.register(UserRoutes, { prefix: "/user" });
app.get("/ping", async (request, reply) => {
  return "pong\n";
});

export const prisma = new PrismaClient();
app.get("/health", async (request, reply) => {
  const status: any = {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  if (!process.env.DATABASE_URL) {
    status.db = "not configured";
    return reply.code(200).send({ ...status });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    status.db = "ok";
    return reply.code(200).send(status);
  } catch (err: any) {
    status.db = "unreachable";
    status.error = String(err?.message ?? err);
    return reply.code(503).send({ ...status, status: "error" });
  }
});

app.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
