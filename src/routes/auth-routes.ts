import { FastifyInstance } from "fastify";
import { register } from "@/controllers/auth-controller";
export const AuthRoutes = (app: FastifyInstance) => {
  app.post("/register", register);
};
