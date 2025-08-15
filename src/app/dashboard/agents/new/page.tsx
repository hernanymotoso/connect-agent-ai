"use client";

import { CreateAgentForm } from "@/components/forms/create-agent-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewAgentPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/dashboard/agents");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/agents">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Criar Novo Agente</h1>
        <p className="text-gray-600">
          Configure seu agente de IA personalizado
        </p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <CreateAgentForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
