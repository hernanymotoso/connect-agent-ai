import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Edit, Settings } from "lucide-react";
import Link from "next/link";

interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt?: string;
  temperature: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

interface AgentDetailsProps {
  agent: Agent;
}

export function AgentDetails({ agent }: AgentDetailsProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle>{agent.name}</CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Badge
                variant={agent.status === "ACTIVE" ? "default" : "secondary"}
              >
                {agent.status === "ACTIVE" ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Descrição</h4>
          <p className="text-sm text-gray-600">{agent.description}</p>
        </div>

        {agent.systemPrompt && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Prompt do Sistema
            </h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {agent.systemPrompt}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Temperatura
            </h4>
            <p className="text-sm text-gray-600">{agent.temperature}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Criado em
            </h4>
            <p className="text-sm text-gray-600">
              {new Date(agent.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Link href={`/dashboard/agents/${agent.id}/edit`}>
            <Button className="w-full" variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar Agente
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
