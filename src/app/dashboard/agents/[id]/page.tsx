import { getSession } from "@/lib/get-session";
import { AgentService } from "@/lib/services/agentService";
import { notFound } from "next/navigation";
import { AgentDetails } from "@/components/agents/agent-details";

export default async function AgentPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  const agent = await AgentService.getAgentById(params.id, session!.user.id);

  if (!agent) {
    notFound();
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      <div className="lg:col-span-1">
        <AgentDetails agent={agent} />
      </div>
    </div>
  );
}
