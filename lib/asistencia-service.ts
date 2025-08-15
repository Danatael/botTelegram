import { prisma } from './prisma';

function getRangoDia(date: Date) {
  const inicio = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const fin = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
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

// Utility to get YYYY-MM-DD string from a Date
function getFechaString(date: Date) {
  return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

// Utilidad para obtener la fecha en formato YYYY-MM-DD en UTC
function getFechaUTCString(date: Date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

// Utilidad robusta para obtener o crear la asistencia del día
async function getOrCreateAsistenciaDelDia(empleadoId: number, fechaReferencia: Date) {
  // Normalizar la fecha a YYYY-MM-DD en UTC
  const fechaStr = getFechaUTCString(fechaReferencia);
  console.log('[getOrCreateAsistenciaDelDia] empleado:', empleadoId, 'fechaReferencia:', fechaReferencia, 'fechaStr:', fechaStr);
  let asistenciaExistente = await prisma.asistencias.findFirst({
    where: {
      empleado_id: empleadoId,
      fecha: new Date(fechaStr)
    },
    orderBy: { id: 'asc' }
  });
  if (asistenciaExistente) {
    return asistenciaExistente;
  }
  const nuevaAsistencia = await prisma.asistencias.create({
    data: { empleado_id: empleadoId, fecha: new Date(fechaStr) }
  });
  return nuevaAsistencia;
}

export async function registrarEntrada(telegramId: number, nombre: string) {
  try {
    const empleado = await getOrCreateEmpleado(telegramId, nombre);
    console.log('[registrarEntrada] empleado:', empleado);
    const hoy = new Date();
    const asistencia = await getOrCreateAsistenciaDelDia(empleado.id, hoy);
    // Actualizar la ubicación textual en la asistencia del día
    await prisma.asistencias.update({
      where: { id: asistencia.id },
      data: {
        ubicacion: "Manantiales de Tehuacán #704, El Riego, Ex- Hacienda, 75763 Tehuacán, Puebla, México."
      }
    });
    console.log('[registrarEntrada] asistencia:', asistencia);
    // Verificar si ya existe una entrada para esta asistencia hoy
    const entradaExistente = await prisma.entradas.findFirst({
      where: { asistencia_id: asistencia.id, empleado_id: empleado.id }
    });
    console.log('[registrarEntrada] entradaExistente:', entradaExistente);
    if (entradaExistente) throw new Error('Ya registraste tu entrada hoy.');
    const nuevaEntrada = await prisma.entradas.create({
      data: { asistencia_id: asistencia.id, empleado_id: empleado.id, hora_entrada: hoy }
    });
    console.log('[registrarEntrada] nuevaEntrada:', nuevaEntrada);
    return asistencia;
  } catch (error) {
    console.error('[registrarEntrada] Error:', error);
    if (error instanceof Error) {
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
    }
    throw error;
  }
}

export async function iniciarComida(telegramId: number, nombre: string) {
  const empleado = await getOrCreateEmpleado(telegramId, nombre);
  const hoy = new Date();
  const asistencia = await getOrCreateAsistenciaDelDia(empleado.id, hoy);
  console.log('[iniciarComida] empleado:', empleado.id, 'asistencia:', asistencia.id, 'fecha:', hoy);
  try {
    // Buscar si ya existe un registro de comida_inicio ABIERTO para hoy
    const comidaAbierta = await prisma.comida_inicio.findFirst({
      where: {
        asistencia_id: asistencia.id,
        empleado_id: empleado.id,
        hora_inicio: { not: null },
        validado: false
      }
    });
    console.log('[iniciarComida] comidaAbierta encontrado:', comidaAbierta);
    if (comidaAbierta) return asistencia;
    const nuevaComida = await prisma.comida_inicio.create({
      data: { asistencia_id: asistencia.id, empleado_id: empleado.id, hora_inicio: hoy, validado: false }
    });
    console.log('[iniciarComida] comida_inicio creado:', nuevaComida);
    return asistencia;
  } catch (error) {
    console.error('[iniciarComida] Error:', error);
    if (error instanceof Error) {
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
    }
    throw error;
  }
}

export async function regresarTrabajo(telegramId: number, nombre: string) {
  const empleado = await getOrCreateEmpleado(telegramId, nombre);
  const hoy = new Date();
  const asistencia = await getOrCreateAsistenciaDelDia(empleado.id, hoy);
  console.log('[regresarTrabajo] empleado:', empleado.id, 'asistencia:', asistencia.id, 'fecha:', hoy);
  try {
    // Buscar el registro de comida_inicio abierto (sin comida_fin)
    const comidaInicio = await prisma.comida_inicio.findFirst({
      where: {
        asistencia_id: asistencia.id,
        empleado_id: empleado.id,
        hora_inicio: { not: null },
        validado: false
      },
      orderBy: { id: 'asc' }
    });
    console.log('[regresarTrabajo] comidaInicio encontrado:', comidaInicio);
    if (!comidaInicio) {
      throw new Error('No tienes una comida pendiente de finalizar hoy.');
    }
    // Registrar el fin de comida en comida_fin
    const comidaFin = await prisma.comida_fin.create({
      data: { asistencia_id: asistencia.id, empleado_id: empleado.id, hora_fin: hoy, validado: true }
    });
    console.log('[regresarTrabajo] comidaFin creado:', comidaFin);
    // Marcar el inicio como validado
    const comidaInicioActualizada = await prisma.comida_inicio.update({
      where: { id: comidaInicio.id },
      data: { validado: true }
    });
    console.log('[regresarTrabajo] comidaInicio actualizado:', comidaInicioActualizada);
    return asistencia;
  } catch (error) {
    console.error('[regresarTrabajo] Error:', error);
    if (error instanceof Error) {
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
    }
    throw error;
  }
}

export async function registrarSalida(telegramId: number, nombre: string) {
  const empleado = await getOrCreateEmpleado(telegramId, nombre);
  const hoy = new Date();
  const asistencia = await getOrCreateAsistenciaDelDia(empleado.id, hoy);
  // Actualizar la ubicación textual en la asistencia del día
  await prisma.asistencias.update({
    where: { id: asistencia.id },
    data: {
      ubicacion: "Manantiales de Tehuacán #704, El Riego, Ex- Hacienda, 75763 Tehuacán, Puebla, México."
    }
  });
  // Verificar si ya existe una salida para esta asistencia hoy
  const salidaExistente = await prisma.salidas.findFirst({
    where: { asistencia_id: asistencia.id, empleado_id: empleado.id }
  });
  if (salidaExistente) throw new Error('Ya registraste tu salida hoy.');
  await prisma.salidas.create({
    data: { asistencia_id: asistencia.id, empleado_id: empleado.id, hora_salida: hoy }
  });
  return asistencia;
}

export async function getPresentesHoy(): Promise<number> {
  const hoy = new Date();
  const fechaStr = hoy.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  // Buscar entradas cuya asistencia sea de hoy
  const presentes = await prisma.entradas.count({
    where: {
      asistencia: {
        fecha: new Date(fechaStr)
      }
    }
  });
  return presentes;
}
