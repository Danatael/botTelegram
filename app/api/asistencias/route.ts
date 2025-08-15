import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Función para convertir BigInt a string en objetos anidados
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

// GET: Listar asistencias con datos de empleado y registros de entrada, comida_inicio, comida_fin y salida
export async function GET() {
  try {
    const asistencias = await prisma.asistencias.findMany({
      include: {
        empleados: true,
        entradas: true,
        comida_inicio: true,
        comida_fin: true,
        salidas: true
      },
      orderBy: { fecha: 'desc' }
    });
    const serializable = replacerBigInt(asistencias);
    return NextResponse.json(serializable);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
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
    return NextResponse.json(replacerBigInt(asistencia));
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar asistencia' }, { status: 500 });
  }
}
