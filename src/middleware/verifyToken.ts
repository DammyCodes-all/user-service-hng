import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export async function verifyToken(req: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.code(401).send({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return reply.code(401).send({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!);
    const userId = (decoded as any)?.userId;
    (req as FastifyRequest & { user?: any }).user = JSON.parse(userId) as any;
  } catch (err) {
    console.error("Token verification error:", err);
    return reply.code(401).send({ message: "Invalid or expired token" });
  }
}
