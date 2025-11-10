import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export const getUserProfile = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = (req as FastifyRequest & { userId?: any }).userId ?? null;
    if (!userId) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }
    return reply.status(200).send({ user });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};
