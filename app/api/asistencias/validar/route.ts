import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/asistencias/validar
export async function POST(request: Request) {
  try {
    const { coords, tipo } = await request.json();
    if (!coords || !tipo || (tipo !== 'entrada' && tipo !== 'salida')) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
    }
    let updated;
    let found;
    if (tipo === 'entrada') {
      found = await prisma.entradas.findMany({ where: { ubicacion: { contains: coords } } });
      console.log('Entradas encontradas:', found);
      updated = await prisma.entradas.updateMany({
        where: { ubicacion: { contains: coords } },
        data: { validado: true },
      });
    } else {
      found = await prisma.salidas.findMany({ where: { ubicacion: { contains: coords } } });
      console.log('Salidas encontradas:', found);
      updated = await prisma.salidas.updateMany({
        where: { ubicacion: { contains: coords } },
        data: { validado: true },
      });
    }
    if (updated.count === 0) {
      return NextResponse.json({ error: 'No se encontró registro para validar', debug: found }, { status: 404 });
    }
    return NextResponse.json({ success: true, debug: found });
  } catch (error) {
    return NextResponse.json({ error: 'Error al validar', details: String(error) }, { status: 500 });
  }
}
