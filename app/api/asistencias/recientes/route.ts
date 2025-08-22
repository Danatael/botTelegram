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
    // Soporta tanto 'YYYY-MM-DD HH:mm:ss' como ISO
    dateObj = dt.includes('T') ? new Date(dt) : new Date(dt.replace(' ', 'T'));
  } else {
    dateObj = dt;
  }
  if (isNaN(dateObj.getTime())) return '-';
  // Formato: YYYY-MM-DD HH:mm:ss
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth()+1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
}

export async function GET() {
  try {
    // Calcular el rango de hoy (00:00 a 23:59)
    const now = new Date();
    const inicio = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const fin = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Últimos 10 registros de entrada de hoy con info de empleado y hora
    const recientes = await prisma.entradas.findMany({
      where: {
        hora_entrada: {
          gte: inicio,
          lte: fin,
          not: null
        }
      },
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

    // Formatear y combinar datos de entrada y salida
    const serializable = replacerBigInt(
      recientes.map(r => {
        // Tomar la última salida asociada a la asistencia (si existe)
        const salida = r.asistencia?.salidas?.length ? r.asistencia.salidas[r.asistencia.salidas.length - 1] : null;
        return {
          id: r.id,
          empleado: r.empleado,
          hora_entrada: formatDateTime(r.hora_entrada),
          ubicacion_entrada: r.ubicacion || '-',
          validado_entrada: r.validado ?? false,
          hora_salida: salida ? formatDateTime(salida.hora_salida) : '-',
          ubicacion_salida: salida?.ubicacion || '-',
          validado_salida: salida?.validado ?? false,
        };
      })
    );
    return NextResponse.json(serializable);
  } catch (error) {
    console.error('Error en /api/asistencias/recientes:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
