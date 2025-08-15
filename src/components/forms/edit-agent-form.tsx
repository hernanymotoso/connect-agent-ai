"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAgentSchema, UpdateAgentInput } from "@/lib/validations/agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt?: string;
  temperature: number;
  status: "ACTIVE" | "INACTIVE";
}

interface EditAgentFormProps {
  agent: Agent;
}

export function EditAgentForm({ agent }: EditAgentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateAgentInput>({
    resolver: zodResolver(updateAgentSchema),
    defaultValues: {
      name: agent.name,
      description: agent.description,
      systemPrompt: agent.systemPrompt || "",
      temperature: agent.temperature,
      status: agent.status,
    },
  });

  const temperature = watch("temperature");

  const onSubmit = async (data: UpdateAgentInput) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar agente");
      }

      toast.success("Agente atualizado com sucesso!");
      router.push(`/dashboard/agents/${agent.id}`);
    } catch (error) {
      console.error("Erro ao atualizar agente:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar agente"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nome do Agente */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Agente</Label>
        <Input
          id="name"
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          rows={3}
          {...register("description")}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* System Prompt */}
      <div className="space-y-2">
        <Label htmlFor="systemPrompt">Prompt do Sistema</Label>
        <Textarea
          id="systemPrompt"
          rows={5}
          {...register("systemPrompt")}
          className={errors.systemPrompt ? "border-red-500" : ""}
        />
        {errors.systemPrompt && (
          <p className="text-sm text-red-500">{errors.systemPrompt.message}</p>
        )}
      </div>

      {/* Temperatura */}
      <div className="space-y-2">
        <Label>Criatividade (Temperatura): {temperature}</Label>
        <Slider
          value={[temperature || 0.7]}
          onValueChange={([value]) => setValue("temperature", value)}
          max={1}
          min={0}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Mais Preciso</span>
          <span>Mais Criativo</span>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
