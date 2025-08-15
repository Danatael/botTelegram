import { prisma } from '../lib/prisma';

async function main() {
  const comidas = await prisma.comidas.findMany({
    select: {
      id: true,
      asistencia_id: true,
      hora_comida_inicio: true,
      hora_comida_fin: true,
      validado: true
    },
    orderBy: { id: 'desc' },
    take: 20 // muestra los 20 más recientes
  });
  console.log('Últimos registros de comidas:');
  for (const c of comidas) {
    console.log(`ID: ${c.id} | Asistencia: ${c.asistencia_id} | Inicio: ${c.hora_comida_inicio} | Fin: ${c.hora_comida_fin} | Validado: ${c.validado}`);
  }
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
