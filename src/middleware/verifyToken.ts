import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

import { prisma } from "@/index";
export async function verifyToken(req: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return reply.code(401).send({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token ?? "", process.env.ACCESS_SECRET!) as any;
    const userId = payload?.userId;
    const role = payload?.role;
    if (!userId)
      return reply.code(401).send({ message: "Invalid token payload" });
    (req as any).user = { id: userId, role };
    return;
  } catch (err) {
    console.error("Token verification error:", err);
    return reply.code(401).send({ message: "Invalid or expired token" });
  }
}

export async function verifyAdmin(req: FastifyRequest, reply: FastifyReply) {
  const user = (req as any).user;
  if (!user) return reply.code(401).send({ message: "No authenticated user" });

  // Prefer canonical comparison
  const role = (user.role ?? "").toString().toLowerCase();
  if (role !== "admin") {
    return reply.code(403).send({ message: "Forbidden: Admins only" });
  }

  // Optionally, re-affirm role in DB to prevent stale/forged tokens
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser || (dbUser.role ?? "").toString().toLowerCase() !== "admin") {
    return reply.code(403).send({ message: "Forbidden: Admins only" });
  }
  return;
}
