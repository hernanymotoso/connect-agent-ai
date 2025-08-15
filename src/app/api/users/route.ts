import { NextRequest, NextResponse } from "next/server";
import { UserService } from "../../../lib/services/userService";

export async function POST(req: NextRequest) {
  try {
    const { email, name, image, googleId } = await req.json();

    // Tentar encontrar usuário existente
    let user = await UserService.getUserByGoogleId(googleId);

    if (!user) {
      // Criar novo usuário
      user = await UserService.createUser({
        email,
        name,
        image,
        googleId,
      });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
