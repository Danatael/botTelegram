import { prisma } from '../lib/prisma';

async function main() {
  const validados = await prisma.comidas.findMany({
    where: { validado: true },
    select: {
      id: true,
      asistencia_id: true,
      hora_comida_inicio: true,
      hora_comida_fin: true,
      validado: true
    },
    orderBy: { id: 'desc' },
    take: 20
  });
  const noValidados = await prisma.comidas.findMany({
    where: { validado: false },
    select: {
      id: true,
      asistencia_id: true,
      hora_comida_inicio: true,
      hora_comida_fin: true,
      validado: true
    },
    orderBy: { id: 'desc' },
    take: 20
  });

  console.log('--- COMIDAS VALIDADAS (validado=1) ---');
  for (const c of validados) {
    console.log(`ID: ${c.id} | Asistencia: ${c.asistencia_id} | Inicio: ${c.hora_comida_inicio} | Fin: ${c.hora_comida_fin} | Validado: ${c.validado}`);
  }
  console.log('\n--- COMIDAS NO VALIDADAS (validado=0) ---');
  for (const c of noValidados) {
    console.log(`ID: ${c.id} | Asistencia: ${c.asistencia_id} | Inicio: ${c.hora_comida_inicio} | Fin: ${c.hora_comida_fin} | Validado: ${c.validado}`);
  }
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
