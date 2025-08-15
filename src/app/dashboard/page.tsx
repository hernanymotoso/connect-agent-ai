import { AgentService } from "@/lib/services/agentService";
import { DashboardStats } from "@/components/dashboard/stats";
import { RecentAgents } from "@/components/dashboard/recent-agents";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { getSession } from "@/lib/get-session";

export default async function DashboardPage() {
  const session = await getSession();

  const agents = await AgentService.getUserAgents(session!.user.id);

  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter((a) => a.status === "ACTIVE").length,
    totalChats: 0, // Implementar quando tiver o modelo Chat
    monthlyUsage: 0, // Implementar métricas
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {session!.user.name}! 👋
        </h1>
        <p className="text-gray-600">
          Gerencie seus agentes de IA e acompanhe seu desempenho
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentAgents agents={agents} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
