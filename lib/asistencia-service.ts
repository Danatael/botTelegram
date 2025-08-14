import { prisma } from './prisma';

function getRangoDia(date: Date) {
  const inicio = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  const fin = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0);
  return { inicio, fin };
}

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
  const { inicio, fin } = getRangoDia(hoy);
  // Buscar o crear la fila de asistencia del día
  let asistencia = await prisma.asistencias.findFirst({
    where: {
      empleado_id: empleado.id,
      fecha: {
        gte: inicio,
        lt: fin
      }
    }
  });
  if (!asistencia) {
    asistencia = await prisma.asistencias.create({
      data: { empleado_id: empleado.id, fecha: inicio }
    });
  }
  // Verificar si ya existe una entrada para esta asistencia hoy
  const entradaExistente = await prisma.entradas.findFirst({
    where: { asistencia_id: asistencia.id }
  });
  if (entradaExistente) throw new Error('Ya registraste tu entrada hoy.');
  // Registrar la entrada SOLO en la tabla hija
  await prisma.entradas.create({
    data: { asistencia_id: asistencia.id, hora_entrada: hoy }
  });
  return asistencia;
}

export async function iniciarComida(telegramId: number, nombre: string) {
  const empleado = await getOrCreateEmpleado(telegramId, nombre);
  const hoy = new Date();
  const { inicio, fin } = getRangoDia(hoy);
  // Buscar la asistencia del día en la tabla asistencias
  let asistencia = await prisma.asistencias.findFirst({
    where: {
      empleado_id: empleado.id,
      fecha: {
        gte: inicio,
        lt: fin
      }
    }
  });
  if (!asistencia) throw new Error('Primero debes registrar tu entrada');
  // Buscar si ya existe un registro de comida para hoy
  let comida = await prisma.comidas.findFirst({
    where: { asistencia_id: asistencia.id }
  });
  if (comida) {
    if (comida.hora_comida_inicio) throw new Error('Ya registraste el inicio de tu comida hoy.');
    // Si existe pero no tiene hora_comida_inicio, actualizarlo
    await prisma.comidas.update({
      where: { id: comida.id },
      data: { hora_comida_inicio: hoy }
    });
  } else {
    // Si no existe, crear uno nuevo SOLO en la tabla comidas
    await prisma.comidas.create({
      data: { asistencia_id: asistencia.id, hora_comida_inicio: hoy }
    });
  }
  return asistencia;
}

export async function regresarTrabajo(telegramId: number, nombre: string) {
  const empleado = await getOrCreateEmpleado(telegramId, nombre);
  const hoy = new Date();
  const { inicio, fin } = getRangoDia(hoy);
  // Buscar la asistencia del día en la tabla asistencias
  let asistencia = await prisma.asistencias.findFirst({
    where: {
      empleado_id: empleado.id,
      fecha: {
        gte: inicio,
        lt: fin
      }
    }
  });
  if (!asistencia) throw new Error('Primero debes registrar tu entrada');
  // Buscar el registro de comida de hoy
  const comida = await prisma.comidas.findFirst({
    where: { asistencia_id: asistencia.id }
  });
  if (!comida || !comida.hora_comida_inicio) throw new Error('Primero debes registrar el inicio de tu comida');
  if (comida.hora_comida_fin) throw new Error('Ya registraste tu regreso de comida hoy.');
  // Validar que haya pasado al menos 1 hora desde el inicio de comida
  const inicioComida = new Date(comida.hora_comida_inicio);
  const diffMs = hoy.getTime() - inicioComida.getTime();
  const diffMin = diffMs / (1000 * 60);
  if (diffMin < 60) {
    throw new Error('Debes tomar al menos 1 hora de comida antes de regresar. Faltan ' + Math.ceil(60 - diffMin) + ' minutos.');
  }
  // Actualizar SOLO la tabla comidas
  await prisma.comidas.update({
    where: { id: comida.id },
    data: { hora_comida_fin: hoy }
  });
  return asistencia;
}

export async function registrarSalida(telegramId: number, nombre: string) {
  const empleado = await getOrCreateEmpleado(telegramId, nombre);
  const hoy = new Date();
  const { inicio, fin } = getRangoDia(hoy);
  let asistencia = await prisma.asistencias.findFirst({
    where: {
      empleado_id: empleado.id,
      fecha: {
        gte: inicio,
        lt: fin
      }
    }
  });
  if (!asistencia) throw new Error('Primero debes registrar tu entrada');
  // Verificar si ya existe una salida para esta asistencia hoy
  const salidaExistente = await prisma.salidas.findFirst({
    where: { asistencia_id: asistencia.id }
  });
  if (salidaExistente) throw new Error('Ya registraste tu salida hoy.');
  // Registrar la salida SOLO en la tabla hija
  await prisma.salidas.create({
    data: { asistencia_id: asistencia.id, hora_salida: hoy }
  });
  return asistencia;
}
