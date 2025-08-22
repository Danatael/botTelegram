import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function replacerBigInt(obj: any): any {
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const empleadoId = searchParams.get('empleadoId');
    const periodo = searchParams.get('periodo');
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');

    let where: any = {};
    // Filtro por empleado
    if (empleadoId) {
      where.empleado_id = Number(empleadoId); // <- corregido para usar el campo real de la base de datos
    }
    // Filtro por periodo
    let start: Date | undefined, end: Date | undefined;
    const now = new Date();
    if (periodo === 'dia') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (periodo === 'semana') {
      const day = now.getDay() || 7;
      start = new Date(now);
      start.setDate(now.getDate() - day + 1);
      start.setHours(0,0,0,0);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (periodo === 'mes') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (periodo === 'año') {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else if (periodo === 'personalizado' && fechaInicio && fechaFin) {
      start = new Date(fechaInicio);
      end = new Date(fechaFin);
      end.setHours(23,59,59,999);
    }
    if (start && end) {
      where.hora_entrada = { gte: start, lte: end };
    }

    const recientes = await prisma.entradas.findMany({
      where,
      orderBy: { hora_entrada: 'desc' },
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
          id: r.id,
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
            ((new Date(salida.hora_salida).getTime() - new Date(r.hora_entrada).getTime()) / 3600000).toFixed(2) : 0,
          fecha: r.hora_entrada ? (typeof r.hora_entrada === 'string' ? r.hora_entrada.split('T')[0] : (r.hora_entrada instanceof Date ? r.hora_entrada.toISOString().split('T')[0] : '-')) : '-',
        };
      })
    );
    return NextResponse.json(serializable);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
