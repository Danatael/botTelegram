import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Listar asistencias con datos de empleado y registros de entrada, comida y salida
export async function GET() {
  const asistencias = await prisma.asistencias.findMany({
    include: {
      empleados: true,
      entradas: true,
      comidas: true,
      salidas: true
    },
    orderBy: { fecha: 'desc' }
  });
  return NextResponse.json(asistencias);
}

// POST: Registrar asistencia manual (solo crea la asistencia, no los registros de tiempo)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { empleadoId, fecha } = data;
    if (!empleadoId) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }
    const asistencia = await prisma.asistencias.create({
      data: {
        empleado_id: empleadoId,
        fecha: fecha ? new Date(fecha) : new Date(),
      },
    });
    return NextResponse.json(asistencia);
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar asistencia' }, { status: 500 });
  }
}
