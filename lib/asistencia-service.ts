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

// Utilidad robusta para obtener o crear la asistencia del día
async function getOrCreateAsistenciaDelDia(empleadoId: number, fechaReferencia: Date) {
  // Usar solo la parte de la fecha (sin hora)
  const soloFecha = new Date(fechaReferencia.getFullYear(), fechaReferencia.getMonth(), fechaReferencia.getDate());
  // Buscar asistencia por usuario y fecha exacta (sin hora)
  const asistenciaExistente = await prisma.asistencias.findFirst({
    where: {
      empleado_id: empleadoId,
      fecha: soloFecha
    },
    orderBy: { id: 'asc' }
  });
  if (asistenciaExistente) {
    console.log('Asistencia encontrada:', asistenciaExistente.id, 'para empleado', empleadoId, 'fecha', asistenciaExistente.fecha);
    return asistenciaExistente;
  }
  // Si no existe, crear una nueva con solo la fecha (sin hora)
  const nuevaAsistencia = await prisma.asistencias.create({
    data: { empleado_id: empleadoId, fecha: soloFecha }
  });
  console.log('Asistencia creada:', nuevaAsistencia.id, 'para empleado', empleadoId, 'fecha', soloFecha);
  return nuevaAsistencia;
}

// Todas las funciones de registro deben usar el mismo asistencia_id del día para el usuario
export async function registrarEntrada(telegramId: number, nombre: string) {
  const empleado = await getOrCreateEmpleado(telegramId, nombre);
  const ahora = new Date();
  const fechaLocal = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);
  // Buscar asistencia SOLO por usuario y fecha
  const asistencia = await getOrCreateAsistenciaDelDia(empleado.id, fechaLocal);
  console.log('USANDO asistencia_id para ENTRADA:', asistencia.id);
  // Verificar si ya existe una entrada para esta asistencia hoy
  const entradaExistente = await prisma.entradas.findFirst({
    where: { asistencia_id: asistencia.id }
  });
  if (entradaExistente) throw new Error('Ya registraste tu entrada hoy.');
  // Registrar la entrada SOLO en la tabla hija
  await prisma.entradas.create({
    data: { asistencia_id: asistencia.id, hora_entrada: ahora }
  });
  return asistencia;
}

export async function iniciarComida(telegramId: number, nombre: string) {
  try {
    const empleado = await getOrCreateEmpleado(telegramId, nombre);
    const ahora = new Date();
    const fechaLocal = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);
    // Buscar asistencia SOLO por usuario y fecha
    const asistencia = await getOrCreateAsistenciaDelDia(empleado.id, fechaLocal);
    console.log('USANDO asistencia_id para COMIDA:', asistencia.id);
    if (!asistencia) throw new Error('Primero debes registrar tu entrada');
    // Buscar si ya existe un registro de comida ABIERTO para hoy (sin hora_comida_fin y validado en false)
    let comidaAbierta = await prisma.comidas.findFirst({
      where: {
        asistencia_id: asistencia.id,
        hora_comida_inicio: { not: null },
        hora_comida_fin: null,
        validado: false
      }
    });
    console.log('DEBUG comidaAbierta:', comidaAbierta);
    if (comidaAbierta) {
      // Si ya hay una comida abierta, no crear otra
      return asistencia;
    }
    // Si no hay registro abierto, crear uno nuevo SOLO en la tabla comidas
    const nuevaComida = await prisma.comidas.create({
      data: { asistencia_id: asistencia.id, hora_comida_inicio: ahora, validado: false }
    });
    console.log('DEBUG nueva comida creada:', nuevaComida);
    // Confirmar que el registro de comida existe y tiene hora_comida_inicio
    const comidaCheck = await prisma.comidas.findFirst({
      where: {
        asistencia_id: asistencia.id,
        hora_comida_inicio: { not: null },
        hora_comida_fin: null,
        validado: false
      }
    });
    console.log('DEBUG comidaCheck:', comidaCheck);
    if (!comidaCheck || !comidaCheck.hora_comida_inicio) {
      throw new Error('Error al registrar el inicio de comida. Intenta de nuevo.');
    }
    return asistencia;
  } catch (error) {
    console.error('Error en iniciarComida:', error);
    throw error;
  }
}

export async function regresarTrabajo(telegramId: number, nombre: string) {
  const empleado = await getOrCreateEmpleado(telegramId, nombre);
  const ahora = new Date();
  const fechaLocal = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  // Buscar asistencia SOLO por usuario y fecha
  const asistencia = await getOrCreateAsistenciaDelDia(empleado.id, fechaLocal);
  // Buscar el registro de comida de hoy SOLO por asistencia_id
  const comida = await prisma.comidas.findFirst({
    where: {
      asistencia_id: asistencia.id,
      hora_comida_inicio: { not: null },
      hora_comida_fin: null,
      validado: false
    },
    orderBy: { id: 'asc' }
  });
  if (!comida) {
    // Mensaje más claro y log de ayuda
    console.warn(`No se encontró registro de comida abierto para asistencia_id=${asistencia.id} (usuario=${empleado.id})`);
    throw new Error('No tienes una comida pendiente de finalizar hoy. Si crees que es un error, contacta a soporte.');
  }
  // Actualizar SOLO la tabla comidas y devolver la hora registrada
  try {
    const comidaActualizada = await prisma.comidas.update({
      where: { id: comida.id },
      data: { hora_comida_fin: ahora, validado: true }
    });
    console.log(`Comida actualizada correctamente: comida_id=${comida.id}, hora_comida_fin=${ahora}`);
    return { asistencia, hora_regreso: comidaActualizada.hora_comida_fin };
  } catch (err) {
    console.error('Error al actualizar hora_comida_fin:', err, { comida });
    throw new Error('Error al registrar el regreso de comida. Contacta a soporte.');
  }
}

export async function registrarSalida(telegramId: number, nombre: string) {
  const empleado = await getOrCreateEmpleado(telegramId, nombre);
  const ahora = new Date();
  const fechaLocal = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);
  // Buscar asistencia SOLO por usuario y fecha
  const asistencia = await getOrCreateAsistenciaDelDia(empleado.id, fechaLocal);
  console.log('USANDO asistencia_id para SALIDA:', asistencia.id);
  if (!asistencia) throw new Error('Primero debes registrar tu entrada');
  // Verificar si ya existe una salida para esta asistencia hoy
  const salidaExistente = await prisma.salidas.findFirst({
    where: { asistencia_id: asistencia.id }
  });
  if (salidaExistente) throw new Error('Ya registraste tu salida hoy.');
  // Registrar la salida SOLO en la tabla hija
  await prisma.salidas.create({
    data: { asistencia_id: asistencia.id, hora_salida: ahora }
  });
  return asistencia;
}
