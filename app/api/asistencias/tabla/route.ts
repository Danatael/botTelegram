import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function replacerBigInt(obj: any) {
  if (Array.isArray(obj)) {
    return obj.map(replacerBigInt);
  } else if (obj && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'bigint') {
        newObj[key] = value.toString();
      } else if (typeof value === 'object' && value !== null) {
        newObj[key] = replacerBigInt(value);
      } else {
        newObj[key] = value;
      }
    }
    return newObj;
  }
  return obj;
}

function formatDateTime(dt: Date | string | null): string {
  if (!dt) return '-';
  let dateObj: Date;
  if (typeof dt === 'string') {
    dateObj = dt.includes('T') ? new Date(dt) : new Date(dt.replace(' ', 'T'));
  } else {
    dateObj = dt;
  }
  if (isNaN(dateObj.getTime())) return '-';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
}

export async function GET() {
  try {
    // Últimos 50 registros de entrada (puedes ajustar el rango si lo deseas)
    const recientes = await prisma.entradas.findMany({
      orderBy: { hora_entrada: 'desc' },
      take: 50,
      include: {
        empleado: true,
        asistencia: {
          include: {
            salidas: true
          }
        }
      }
    });

    const serializable = replacerBigInt(
      recientes.map(r => {
        const salida = r.asistencia?.salidas?.length ? r.asistencia.salidas[r.asistencia.salidas.length - 1] : null;
        return {
          id: r.id, // Usar siempre el id único de la entrada
          name: r.empleado?.nombre || '-',
          department: r.empleado?.departamento || '-',
          checkIn: formatDateTime(r.hora_entrada),
          checkOut: salida ? formatDateTime(salida.hora_salida) : '-',
          locationIn: r.ubicacion || '-',
          locationOut: salida?.ubicacion || '-',
          locationInValidado: typeof r.validado === 'boolean' ? r.validado : !!r.validado,
          locationOutValidado: typeof salida?.validado === 'boolean' ? salida.validado : !!salida?.validado,
          status: salida ? 'Completo' : 'Activo',
          hours: salida && r.hora_entrada && salida.hora_salida ?
            ((new Date(salida.hora_salida).getTime() - new Date(r.hora_entrada).getTime()) / 3600000).toFixed(2) : 0
        };
      })
    );
    return NextResponse.json(serializable);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
