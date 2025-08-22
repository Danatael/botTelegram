import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/asistencias/por-rol?dateRange=7d
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateRange = searchParams.get('dateRange') || '7d';
    // Actualiza los roles a los nuevos nombres exactamente como en la base de datos
    const roles = [
      "Administración - Recargalos",
      "Administrativo - Recargalos",
      "Técnico Instalador",
      "Marketing",
      "Soporte Técnico Administrativo",
      "Soporte Técnico"
    ];

    // Calcular fechas según rango
    const now = new Date();
    let start: Date;
    if (dateRange === '1d') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (dateRange === '30d') {
      start = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '90d') {
      start = new Date(now.getTime() - 89 * 24 * 60 * 60 * 1000);
    } else if (dateRange === '1y') {
      start = new Date(now.getFullYear(), 0, 1);
    } else {
      // 7d por defecto
      start = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
    }
    start.setHours(0,0,0,0);

    // Contar entradas por cada departamento exacto
    const data = await Promise.all(
      roles.map(async (rol) => {
        const count = await prisma.entradas.count({
          where: {
            hora_entrada: { gte: start, lte: now },
            empleado: { departamento: rol }
          }
        });
        return { name: rol, value: count };
      })
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
