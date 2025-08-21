import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Calcular el inicio de la semana (lunes)
    const now = new Date();
    const day = now.getDay(); // 0=domingo, 1=lunes, ...
    const diffToMonday = (day === 0 ? 6 : day - 1);
    const inicio = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday, 0, 0, 0, 0);
    const fin = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Buscar entradas de la semana con su salida asociada
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
        if (horas > 0 && horas < 24) { // descartar valores atípicos
          totalHoras += horas;
          count++;
        }
      }
    });
    const avg = count > 0 ? (totalHoras / count) : 0;
    return NextResponse.json({ promedio: Number(avg.toFixed(2)), registros: count, rango: `${inicio.toISOString().slice(0,10)} a ${fin.toISOString().slice(0,10)}` });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
