import { Prisma, PrismaClient } from "@prisma/client";
import {
  createUserSchema,
  updateUserSchema,
  CreateUserInput,
  UpdateUserInput,
} from "../validations/user";
import { creativityAgentFunctionsApi } from "@/utils/api";

const prisma = new PrismaClient();

export class UserService {
  static async createUser(data: CreateUserInput) {
    const validatedData = createUserSchema.parse(data);
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    if (existingUser) throw new Error("Usuário com este email já existe");
    if (validatedData.googleId) {
      const existingGoogleUser = await prisma.user.findUnique({
        where: { googleId: validatedData.googleId },
      });
      if (existingGoogleUser) throw new Error("Usuário com este Google ID já existe");
    }
   console.log("CREATING USER") 
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const createdUser = await tx.user.create({
        data: validatedData,
      });
      await creativityAgentFunctionsApi.post('/cloud-function', {
        userId: createdUser.id,
      });
    })
  }

  static async updateUser(id: string, data: UpdateUserInput) {
    const validatedData = updateUserSchema.parse(data);
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) throw new Error("Usuário não encontrado");
    return await prisma.user.update({
      where: { id },
      data: validatedData,
    });
  }

  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        agents: true,
      },
    });
  }

  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        agents: true,
      },
    });
  }

  static async getUserByGoogleId(googleId: string) {
    return await prisma.user.findUnique({
      where: { googleId },
      include: {
        agents: true,
      },
    });
  }
}
