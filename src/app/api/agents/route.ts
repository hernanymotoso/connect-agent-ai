import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AgentService } from "@/lib/services/agentService";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const data = await req.json();
    const agent = await AgentService.createAgent(session.user.id, data);

    return NextResponse.json({ agent }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agente:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const agents = await AgentService.getUserAgents(session.user.id);

    return NextResponse.json({ agents }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar agentes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
