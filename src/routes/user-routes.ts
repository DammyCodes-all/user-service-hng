import { FastifyInstance } from "fastify";
import { getUserProfile, getProfileById } from "@/controllers/user-controller";
import { verifyToken, verifyAdmin } from "@/middleware/verifyToken";
export const UserRoutes = (app: FastifyInstance) => {
  app.get("/profile", { preHandler: [verifyToken] }, getUserProfile);
  app.get<{ Params: { id: string } }>(
    "/profile/:id",
    { preHandler: [verifyToken, verifyAdmin] },
    getProfileById
  );
};
