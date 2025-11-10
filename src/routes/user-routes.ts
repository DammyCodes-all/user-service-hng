import { FastifyInstance } from "fastify";
import { getUserProfile } from "@/controllers/user-controller";
import { verifyToken } from "@/middleware/verifyToken";
export const UserRoutes = (app: FastifyInstance) => {
  app.get("/profile", { preHandler: [verifyToken] }, getUserProfile);
};
