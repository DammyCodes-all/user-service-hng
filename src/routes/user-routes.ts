import { FastifyInstance } from "fastify";
import { getUserProfile, getProfileById, getPreferenceById, updatePreferenceById, createPreferenceById } from "@/controllers/user-controller";
import { verifyToken, verifyAdmin } from "@/middleware/verifyToken";
export const UserRoutes = (app: FastifyInstance) => {
  app.get("/profile", { preHandler: [verifyToken] }, getUserProfile);
  app.get<{ Params: { id: string } }>(
    "/profile/:id",
    { preHandler: [verifyToken, verifyAdmin] },
    getProfileById
  );
  app.get<{ Params: { id: string } }>(
    "/preference/:id",
    { preHandler: [verifyToken, verifyAdmin] },
    getPreferenceById
  );

  app.patch<{ Params: { id: string } }>(
    "/preference/:id",
    { preHandler: [verifyToken, verifyAdmin] },
    updatePreferenceById
  );
  app.post<{ Params: { id: string } }>(
    "/preference/:id",
    { preHandler: [verifyToken, verifyAdmin] },
    createPreferenceById
  );
};
