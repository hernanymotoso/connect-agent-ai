import { AgentService } from "@/lib/services/agentService";
import { AgentsList } from "@/components/agents/agents-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/get-session";

export default async function AgentsPage() {
  const session = await getSession();

  const agents = await AgentService.getUserAgents(session!.user.id);
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Agentes</h1>
          <p className="text-gray-600">
            Gerencie todos os seus agentes de IA em um só lugar
          </p>
        </div>
        <Link href="/dashboard/agents/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Agente
          </Button>
        </Link>
      </div>

      <AgentsList agents={agents} />
    </div>
  );
}
