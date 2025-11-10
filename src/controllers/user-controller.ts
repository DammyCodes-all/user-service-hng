import { FastifyReply, FastifyRequest, RouteHandlerMethod } from "fastify";
import { prisma } from "@/index";

export const getUserProfile = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = (req as FastifyRequest & { user?: any }).user?.id ?? null;
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

export const getProfileById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return reply.status(400).send({ message: "User ID is required" });
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

export const getPreferenceById: RouteHandlerMethod = async (req, reply) => {
  try {
    const { id } = (req.params as { id?: string }) ?? {};
    if (!id) {
      return reply.status(400).send({ message: "User ID is required" });
    }
    const preference = await prisma.userPreference.findUnique({
      where: { userId: id },
    });
    if (!preference) {
      return reply.status(404).send({ message: "Preference not found" });
    }
    return reply.status(200).send({ preference });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

export const updatePreferenceById: RouteHandlerMethod = async (req, reply) => {
  try {
    const { id } = (req.params as { id?: string }) ?? {};
    if (!id) {
      return reply.status(400).send({ message: "User ID is required" });
    }

    const body = req.body as Partial<{
      email_enabled: boolean;
      push_enabled: boolean;
      language: string;
      timezone?: string | null;
    }>;

    if (!body || Object.keys(body).length === 0) {
      return reply.status(400).send({ message: "No data provided to update" });
    }

    const existing = await prisma.userPreference.findUnique({
      where: { userId: id },
    });
    if (!existing) {
      return reply.status(404).send({ message: "Preference not found" });
    }

    const updated = await prisma.userPreference.update({
      where: { userId: id },
      data: body as any,
    });

    return reply.status(200).send({ preference: updated });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

export const createPreferenceById: RouteHandlerMethod = async (req, reply) => {
  try {
    const { id } = (req.params as { id?: string }) ?? {};
    if (!id) {
      return reply.status(400).send({ message: "User ID is required" });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    const existing = await prisma.userPreference.findUnique({
      where: { userId: id },
    });
    if (existing) {
      return reply
        .status(409)
        .send({ message: "Preference already exists for this user" });
    }

    const body = req.body as Partial<{
      email_enabled: boolean;
      push_enabled: boolean;
      language: string;
      timezone?: string | null;
    }>;

    // apply defaults if not provided
    const email_enabled = body?.email_enabled ?? true;
    const push_enabled = body?.push_enabled ?? true;
    const language = body?.language ?? "en";
    const timezone = body?.timezone ?? null;

    const created = await prisma.userPreference.create({
      data: {
        userId: id,
        email_enabled,
        push_enabled,
        language,
        timezone,
      },
    });

    return reply.status(201).send({ preference: created });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};
