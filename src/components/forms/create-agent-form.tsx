"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAgentSchema, CreateAgentInput } from "@/lib/validations/agent";
import { useRouter } from "next/navigation";

interface CreateAgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateAgentForm({ onSuccess, onCancel }: CreateAgentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateAgentInput>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      temperature: 0.7,
    },
  });

  const temperature = watch("temperature");

  const onSubmit = async (data: CreateAgentInput) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar agente");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/agents");
      }
    } catch (error) {
      console.error("Erro ao criar agente:", error);
      setError(error instanceof Error ? error.message : "Erro ao criar agente");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Erro global */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Nome do Agente */}
      <div className="space-y-2">
        <label htmlFor="name" className="label">
          Nome do Agente *
        </label>
        <input
          id="name"
          type="text"
          placeholder="Ex: Assistente de Vendas"
          className={`input ${errors.name ? "border-red-500" : ""}`}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <label htmlFor="description" className="label">
          Descrição *
        </label>
        <textarea
          id="description"
          placeholder="Descreva o que seu agente faz..."
          rows={3}
          className={`input textarea ${
            errors.description ? "border-red-500" : ""
          }`}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* System Prompt */}
      <div className="space-y-2">
        <label htmlFor="systemPrompt" className="label">
          Prompt do Sistema (Opcional)
        </label>
        <textarea
          id="systemPrompt"
          placeholder="Instruções específicas para o comportamento do agente..."
          rows={5}
          className={`input textarea ${
            errors.systemPrompt ? "border-red-500" : ""
          }`}
          {...register("systemPrompt")}
        />
        {errors.systemPrompt && (
          <p className="text-sm text-red-500">{errors.systemPrompt.message}</p>
        )}
        <p className="text-sm text-gray-500">
          O prompt do sistema define o comportamento e personalidade do seu
          agente.
        </p>
      </div>

      {/* Temperatura */}
      <div className="space-y-2">
        <label className="label">
          Criatividade (Temperatura): {temperature}
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) =>
              setValue("temperature", parseFloat(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Mais Preciso</span>
            <span>Mais Criativo</span>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary flex-1"
        >
          {isLoading ? "Criando..." : "Criar Agente"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn btn-outline"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
