import { prisma } from '../lib/prisma';

async function main() {
  // Validated comida_inicio
  const validados = await prisma.comida_inicio.findMany({
    where: { validado: true },
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
  // Not validated comida_inicio
  const noValidados = await prisma.comida_inicio.findMany({
    where: { validado: false },
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

  console.log('--- COMIDA_INICIO VALIDADOS (validado=1) ---');
  for (const c of validados) {
    console.log(`ID: ${c.id} | Asistencia: ${c.asistencia_id} | Empleado: ${c.empleado_id} | Inicio: ${c.hora_inicio} | Validado: ${c.validado}`);
  }
  console.log('\n--- COMIDA_INICIO NO VALIDADOS (validado=0) ---');
  for (const c of noValidados) {
    console.log(`ID: ${c.id} | Asistencia: ${c.asistencia_id} | Empleado: ${c.empleado_id} | Inicio: ${c.hora_inicio} | Validado: ${c.validado}`);
  }
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
