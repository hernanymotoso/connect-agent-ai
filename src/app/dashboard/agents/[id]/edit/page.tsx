import { getSession } from "@/lib/get-session";
import { AgentService } from "@/lib/services/agentService";
import { notFound } from "next/navigation";
import { EditAgentForm } from "@/components/forms/edit-agent-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditAgentPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const session = await getSession();
  const agent = await AgentService.getAgentById(id, session!.user.id);

  if (!agent) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/agents/${agent.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Agente</h1>
        <p className="text-gray-600">Atualize as configurações do seu agente</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <EditAgentForm agent={agent} />
      </div>
    </div>
  );
}
