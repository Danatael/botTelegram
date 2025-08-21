import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Devuelve el porcentaje de empleados que cumplieron al menos 8 horas hoy
export async function GET() {
  try {
    // Obtener fecha de hoy (sin hora)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Obtener todas las entradas de hoy
    const entradas = await prisma.entradas.findMany({
      where: {
        hora_entrada: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        asistencia: {
          include: {
            salidas: true,
          },
        },
        empleado: true,
      },
    });

    // Mapear por empleado y calcular horas trabajadas (emparejando cada entrada con la salida más cercana posterior)
    const empleadosMap = new Map();
    for (const entrada of entradas) {
      if (!entrada.hora_entrada) continue;
      // Buscar la salida más cercana posterior a la entrada
      const salidas = entrada.asistencia?.salidas || [];
      const entradaHora = typeof entrada.hora_entrada === 'string' ? new Date(entrada.hora_entrada) : entrada.hora_entrada;
      const salidaCercana = salidas
        .filter(s => s.hora_salida && (typeof s.hora_salida === 'string' ? new Date(s.hora_salida) : s.hora_salida) > entradaHora)
        .sort((a, b) => {
          const aHora = a.hora_salida ? (typeof a.hora_salida === 'string' ? new Date(a.hora_salida) : a.hora_salida) : null;
          const bHora = b.hora_salida ? (typeof b.hora_salida === 'string' ? new Date(b.hora_salida) : b.hora_salida) : null;
          if (!aHora && !bHora) return 0;
          if (!aHora) return 1;
          if (!bHora) return -1;
          return aHora.getTime() - bHora.getTime();
        })[0];
      if (!salidaCercana || !salidaCercana.hora_salida) continue;
      const salidaHora = typeof salidaCercana.hora_salida === 'string' ? new Date(salidaCercana.hora_salida) : salidaCercana.hora_salida;
      if (!salidaHora) continue;
      const horas = (salidaHora.getTime() - entradaHora.getTime()) / 3600000;
      if (!empleadosMap.has(entrada.empleado_id)) {
        empleadosMap.set(entrada.empleado_id, horas);
      } else {
        empleadosMap.set(entrada.empleado_id, empleadosMap.get(entrada.empleado_id) + horas);
      }
    }

    // Contar cuántos empleados cumplieron 8h o más
    let cumplen = 0;
    empleadosMap.forEach(horas => {
      if (horas >= 8) cumplen++;
    });

    // Total de empleados activos
    const totalEmpleados = await prisma.empleados.count();
    const porcentaje = totalEmpleados > 0 ? ((cumplen / totalEmpleados) * 100).toFixed(1) : '0.0';

    return NextResponse.json({ cumplimiento: porcentaje });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
