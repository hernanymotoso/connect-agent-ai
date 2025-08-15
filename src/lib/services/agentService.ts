import { PrismaClient } from "@prisma/client";
import {
  createAgentSchema,
  updateAgentSchema,
  CreateAgentInput,
  UpdateAgentInput,
} from "../validations/agent";
import { InstanceService } from "./instanceService";

const prisma = new PrismaClient();

export class AgentService {
  static async createAgent(userId: string, data: CreateAgentInput) {
    const validatedData = createAgentSchema.parse(data);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { agents: true },
    });
    if (!user) throw new Error("Usuário não encontrado");
    const AGENT_LIMIT = 3;
    if (user.agents.length >= AGENT_LIMIT) {
      throw new Error(
        `Você atingiu o limite de ${AGENT_LIMIT} agentes. Upgrade seu plano para criar mais.`
      );
    }
    const existingAgent = await prisma.agent.findFirst({
      where: {
        userId,
        name: validatedData.name,
      },
    });
    if (existingAgent)
      throw new Error("Você já possui um agente com este nome");
    await prisma.$transaction(
      async (tx) => {
        const createdAgent = await tx.agent.create({
          data: {
            ...validatedData,
            userId,
          },
        });

        await InstanceService.createInstanceWithTransaction(
          {
            agentId: createdAgent.id,
            name: createdAgent.id,
            qrcode: true,
            userId: userId,
          },
          tx
        );
      },
      { timeout: 20000 }
    );
  }

  static async updateAgent(id: string, userId: string, data: UpdateAgentInput) {
    const validatedData = updateAgentSchema.parse(data);
    const existingAgent = await prisma.agent.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (!existingAgent) {
      throw new Error("Agente não encontrado ou não pertence a você");
    }
    if (validatedData.name && validatedData.name !== existingAgent.name) {
      const duplicateAgent = await prisma.agent.findFirst({
        where: {
          userId,
          name: validatedData.name,
          id: { not: id },
        },
      });

      if (duplicateAgent) {
        throw new Error("Você já possui um agente com este nome");
      }
    }

    return await prisma.agent.update({
      where: { id },
      data: validatedData,
    });
  }

  static async deleteAgent(id: string, userId: string) {
    const existingAgent = await prisma.agent.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingAgent) {
      throw new Error("Agente não encontrado ou não pertence a você");
    }

    return await prisma.agent.delete({
      where: { id },
    });
  }

  static async getUserAgents(userId: string) {
    return await prisma.agent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        instance: true,
      },
    });
  }

  static async getAgentById(id: string, userId: string) {
    return await prisma.agent.findFirst({
      where: {
        id,
        userId,
      },
    });
  }
}
