import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Datos inválidos", errors: result.error.format() },
        { status: 400 }
      );
    }

    console.log("Datos recibidos correctamente:", result.data);

    return NextResponse.json({ message: "¡Usuario registrado!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
  }
}