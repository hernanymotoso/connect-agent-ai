import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Agent {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

interface RecentAgentsProps {
  agents: Agent[];
}

export function RecentAgents({ agents }: RecentAgentsProps) {
  const recentAgents = agents.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agentes Recentes</CardTitle>
        <CardDescription>
          Seus agentes mais recentemente criados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentAgents.length === 0 ? (
          <div className="text-center py-6">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Nenhum agente criado
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Comece criando seu primeiro agente de IA
            </p>
            <Link href="/dashboard/agents/new">
              <Button size="sm">Criar Agente</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {agent.name}
                    </h4>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {agent.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      agent.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {agent.status === "ACTIVE" ? "Ativo" : "Inativo"}
                  </Badge>
                  <Link href={`/dashboard/agents/${agent.id}`}>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
