import { prisma } from './prisma';

export async function getOrCreateEmpleado(telegramId: number, nombre: string) {
  let empleado = await prisma.empleados.findUnique({ where: { telegram_id: BigInt(telegramId) } });
  if (!empleado) {
    empleado = await prisma.empleados.create({
      data: { nombre, telegram_id: BigInt(telegramId) }
    });
  }
  return empleado;
}

export async function registrarEntrada(telegramId: number, nombre: string) {
  const empleado = await getOrCreateEmpleado(telegramId, nombre);
  const hoy = new Date();
  const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  let asistencia = await prisma.asistencias.findFirst({
    where: { empleado_id: empleado.id, fecha }
  });
  if (!asistencia) {
    asistencia = await prisma.asistencias.create({
      data: { empleado_id: empleado.id, fecha, hora_entrada: hoy }
    });
  } else {
    asistencia = await prisma.asistencias.update({
      where: { id: asistencia.id },
      data: { hora_entrada: hoy }
    });
  }
  return asistencia;
}

export async function iniciarComida(telegramId: number, nombre: string) {
  const empleado = await getOrCreateEmpleado(telegramId, nombre);
  const hoy = new Date();
  const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  let asistencia = await prisma.asistencias.findFirst({
    where: { empleado_id: empleado.id, fecha }
  });
  if (!asistencia) throw new Error('Primero debes registrar tu entrada');
  asistencia = await prisma.asistencias.update({
    where: { id: asistencia.id },
    data: { hora_comida_inicio: hoy }
  });
  return asistencia;
}

export async function regresarTrabajo(telegramId: number, nombre: string) {
  const empleado = await getOrCreateEmpleado(telegramId, nombre);
  const hoy = new Date();
  const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  let asistencia = await prisma.asistencias.findFirst({
    where: { empleado_id: empleado.id, fecha }
  });
  if (!asistencia) throw new Error('Primero debes registrar tu entrada');
  asistencia = await prisma.asistencias.update({
    where: { id: asistencia.id },
    data: { hora_comida_fin: hoy }
  });
  return asistencia;
}

export async function registrarSalida(telegramId: number, nombre: string) {
  const empleado = await getOrCreateEmpleado(telegramId, nombre);
  const hoy = new Date();
  const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  let asistencia = await prisma.asistencias.findFirst({
    where: { empleado_id: empleado.id, fecha }
  });
  if (!asistencia) throw new Error('Primero debes registrar tu entrada');
  asistencia = await prisma.asistencias.update({
    where: { id: asistencia.id },
    data: { hora_salida: hoy }
  });
  return asistencia;
}
