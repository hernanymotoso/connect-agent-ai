import { z } from "zod";

export const createAgentSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),

  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),

  systemPrompt: z
    .string()
    .min(20, "Prompt do sistema deve ter pelo menos 20 caracteres")
    .max(4000, "Prompt do sistema deve ter no máximo 4000 caracteres"),
  temperature: z
    .number()
    .min(0, "Temperatura deve ser entre 0 e 1")
    .max(1, "Temperatura deve ser entre 0 e 1")
    .default(0.7)
    .optional(),
});

export const updateAgentSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),

  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional(),

  systemPrompt: z
    .string()
    .min(20, "Prompt do sistema deve ter pelo menos 20 caracteres")
    .max(4000, "Prompt do sistema deve ter no máximo 4000 caracteres")
    .optional(),

  temperature: z
    .number()
    .min(0, "Temperatura deve ser entre 0 e 1")
    .max(1, "Temperatura deve ser entre 0 e 1")
    .optional(),

  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export type CreateAgentInput = z.infer<typeof createAgentSchema>;
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;
