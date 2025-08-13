import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Listar asistencias con datos de empleado
export async function GET() {
  const asistencias = await prisma.asistencias.findMany({
    include: { empleados: true },
    orderBy: { fecha: 'desc' }
  });
  return NextResponse.json(asistencias);
}

// POST: Registrar asistencia manual
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { empleadoId, tipo, fecha } = data;
    if (!empleadoId || !tipo) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }
    const asistencia = await prisma.asistencias.create({
      data: {
        empleado_id: empleadoId,
        // tipo: tipo, // Si tienes un campo tipo, descomenta esto y agrégalo al modelo
        fecha: fecha ? new Date(fecha) : new Date(),
      },
    });
    return NextResponse.json(asistencia);
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar asistencia' }, { status: 500 });
  }
}
