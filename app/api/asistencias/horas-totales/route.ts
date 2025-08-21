import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Calcular el inicio y fin del mes actual
    const now = new Date();
    const inicio = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const fin = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Buscar entradas del mes con su salida asociada
    const entradas = await prisma.entradas.findMany({
      where: {
        hora_entrada: {
          gte: inicio,
          lte: fin,
          not: null
        }
      },
      include: {
        asistencia: {
          include: {
            salidas: true
          }
        }
      }
    });

    // Calcular horas trabajadas por registro (solo si hay salida)
    let totalHoras = 0;
    let count = 0;
    entradas.forEach(e => {
      const salida = e.asistencia?.salidas?.length ? e.asistencia.salidas[e.asistencia.salidas.length - 1] : null;
      if (e.hora_entrada && salida?.hora_salida) {
        const horas = (new Date(salida.hora_salida).getTime() - new Date(e.hora_entrada).getTime()) / 3600000;
        if (horas > 0 && horas < 24) {
          totalHoras += horas;
          count++;
        }
      }
    });
    return NextResponse.json({ total: Number(totalHoras.toFixed(2)), registros: count, rango: `${inicio.toISOString().slice(0,10)} a ${fin.toISOString().slice(0,10)}` });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
