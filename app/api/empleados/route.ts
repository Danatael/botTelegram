import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Función para convertir BigInt a string en objetos/arrays
function replacerBigInt(key: string, value: any) {
  return typeof value === 'bigint' ? value.toString() : value;
}

// GET /api/empleados - Listar empleados
export async function GET() {
  try {
    // Log para depuración
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    const empleados = await prisma.empleados.findMany();
    // Serializar BigInt a string
    return new Response(JSON.stringify(empleados, replacerBigInt), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Log del error exacto
    console.error('Error al obtener empleados:', error);
    return NextResponse.json({ error: 'Error al obtener empleados', details: String(error) }, { status: 500 });
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
    // Serializar BigInt a string
    return new Response(JSON.stringify(empleado, replacerBigInt), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear empleado' }, { status: 500 });
  }
}
