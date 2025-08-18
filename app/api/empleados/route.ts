import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/empleados - Listar empleados
export async function GET() {
  try {
    const empleados = await prisma.empleados.findMany();
    return NextResponse.json(empleados);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener empleados' }, { status: 500 });
  }
}

// POST /api/empleados - Crear empleado
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { nombre, telegramId } = data;
    if (!nombre || !telegramId) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }
    const empleado = await prisma.empleados.create({
      data: { nombre, telegram_id: BigInt(telegramId) },
    });
    return NextResponse.json(empleado);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear empleado' }, { status: 500 });
  }
}
