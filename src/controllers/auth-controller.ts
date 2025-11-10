import { FastifyRequest, FastifyReply } from "fastify";
import type { RegisterBody } from "@/lib/auth-types";
import { z } from "zod";
import { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";
import { generateTokens } from "@/utils/generate-tokens";
const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (
  req: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) => {
  try {
    const parsedBody = registerSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return reply.status(400).send({ error: "Invalid request body" });
    }
    const { name, password, email } = parsedBody.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return reply.code(400).send({ message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const { accessToken, refreshToken } = generateTokens(email);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        refreshToken,
      },
    });
    console.log("Registered user:", user);
    return reply.status(201).send({
      user: { id: user?.id, name: user?.name, email: user?.email },
      message: "User registered successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};
