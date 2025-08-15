import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),

  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres")
    .optional(),

  image: z.string().url("URL da imagem inválida").optional(),

  googleId: z.string().min(1, "Google ID é obrigatório"),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres")
    .optional(),

  image: z.string().url("URL da imagem inválida").optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
