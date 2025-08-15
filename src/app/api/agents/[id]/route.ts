export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { AgentService } from "../../../../lib/services/agentService";
import { getSession } from "@/lib/get-session";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const data = await req.json();
    const agent = await AgentService.updateAgent(
      params.id,
      session.user.id,
      data
    );

    return NextResponse.json({ agent }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar agente:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await AgentService.deleteAgent(params.id, session.user.id);

    return NextResponse.json(
      { message: "Agente deletado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao deletar agente:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 400 }
    );
  }
}
