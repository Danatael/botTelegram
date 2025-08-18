import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';

// Devuelve la cantidad de empleados que han registrado entrada por día de la semana actual
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateRange = searchParams.get('dateRange') || '7d';

  let startDate: Date, endDate: Date;
  const today = new Date();
  if (dateRange === '1d') {
    startDate = endDate = today;
  } else if (dateRange === '30d') {
    startDate = subDays(today, 29);
    endDate = today;
  } else if (dateRange === '90d') {
    startDate = subDays(today, 89);
    endDate = today;
  } else if (dateRange === '1y') {
    startDate = subDays(today, 364);
    endDate = today;
  } else {
    // Default: últimos 7 días
    startDate = subDays(today, 6);
    endDate = today;
  }

  // Obtener los registros de entradas agrupados por día
  const entradas = await prisma.entradas.findMany({
    where: {
      hora_entrada: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      hora_entrada: true,
      empleado_id: true,
    },
  });

  // Agrupar por día de la semana y contar empleados únicos
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const conteo: Record<string, Set<number>> = {
    'Lun': new Set(),
    'Mar': new Set(),
    'Mié': new Set(),
    'Jue': new Set(),
    'Vie': new Set(),
    'Sáb': new Set(),
    'Dom': new Set(),
  };

  entradas.forEach((entrada) => {
    const dia = dias[new Date(entrada.hora_entrada as Date).getDay()];
    conteo[dia]?.add(Number(entrada.empleado_id));
  });

  // Formatear para la gráfica
  const result = dias.slice(1).concat(dias[0]).map((dia) => ({
    date: dia,
    asistencia: conteo[dia]?.size || 0,
  }));

  return NextResponse.json(result);
}
