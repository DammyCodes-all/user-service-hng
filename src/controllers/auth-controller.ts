import { FastifyRequest, FastifyReply } from "fastify";
import type { RegisterBody } from "@/lib/auth-types";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
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
  // Registration logic here
};
