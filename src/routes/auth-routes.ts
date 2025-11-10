import { FastifyInstance } from "fastify";

export const AuthRoutes = (app: FastifyInstance) => {
  app.get("/login", (req, res) => {
    res.send({ message: "Login route" });
  });
};
