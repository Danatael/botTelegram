import { prisma } from '../lib/prisma';

async function main() {
  try {
    // Fetch the latest 20 comida_inicio records
    const inicios = await prisma.comida_inicio.findMany({
      select: {
        id: true,
        asistencia_id: true,
        empleado_id: true,
        hora_inicio: true,
        validado: true
      },
      orderBy: { id: 'desc' },
      take: 20
    });
    // Fetch the latest 20 comida_fin records
    const fines = await prisma.comida_fin.findMany({
      select: {
        id: true,
        asistencia_id: true,
        empleado_id: true,
        hora_fin: true,
        validado: true
      },
      orderBy: { id: 'desc' },
      take: 20
    });
    console.log('Últimos registros de comida_inicio:');
    for (const c of inicios) {
      console.log(`ID: ${c.id} | Asistencia: ${c.asistencia_id} | Empleado: ${c.empleado_id} | Inicio: ${c.hora_inicio} | Validado: ${c.validado}`);
    }
    console.log('\nÚltimos registros de comida_fin:');
    for (const c of fines) {
      console.log(`ID: ${c.id} | Asistencia: ${c.asistencia_id} | Empleado: ${c.empleado_id} | Fin: ${c.hora_fin} | Validado: ${c.validado}`);
    }
  } catch (error) {
    console.error('Ocurrió un error al consultar los registros de comida:', error);
    if (error instanceof Error) {
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
    }
  } finally {
    process.exit(0);
  }
}

main().catch(e => { console.error('Error inesperado:', e); process.exit(1); });
