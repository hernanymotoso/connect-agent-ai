import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, HelpCircle } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
        <CardDescription>Tarefas comuns para começar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href="/dashboard/agents/new" className="block">
          <Button className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            Criar Novo Agente
          </Button>
        </Link>

        <Button variant="outline" className="w-full justify-start">
          <BookOpen className="mr-2 h-4 w-4" />
          Ver Documentação
        </Button>

        <Button variant="outline" className="w-full justify-start">
          <HelpCircle className="mr-2 h-4 w-4" />
          Central de Ajuda
        </Button>
      </CardContent>
    </Card>
  );
}
