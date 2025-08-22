import { Telegraf } from 'telegraf';
import { 
  findMatchingCategory, 
  getRandomResponse,
  companyData 
} from './bot-training';
import {
  registrarEntrada,
  iniciarComida,
  regresarTrabajo,
  registrarSalida,
  registrarEntradaConUbicacion,
  registrarSalidaConUbicacion
} from './asistencia-service';

// Función para crear el bot (se ejecuta después de cargar las variables de entorno)
function createBot() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN no está definido en las variables de entorno');
  }

  // Crear instancia del bot
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

  // Función para procesar mensajes inteligentes mejorada
  function processIntelligentMessage(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  // Usar el sistema de entrenamiento avanzado
  const matchingCategory = findMatchingCategory(message);
  if (matchingCategory) {
    const response = getRandomResponse(matchingCategory);
    if (response) return response;
  }
  
  // Consultas específicas sobre horarios
  if (lowerMessage.includes('horario') || lowerMessage.includes('hora') || lowerMessage.includes('turno')) {
    return `⏰ *Horarios de ${companyData.name}*\n\n` +
           `🕐 **Jornada laboral:**\n` +
           `• Entrada: ${companyData.workingHours.start}\n` +
           `• Salida: ${companyData.workingHours.end}\n` +
           `• Almuerzo: ${companyData.workingHours.lunch}\n\n` +
           `⚡ **Políticas:**\n` +
           `• Tolerancia: ${companyData.policies.tolerance}\n` +
           `• Tiempo de almuerzo: ${companyData.policies.lunchTime}\n` +
           `• Descansos: ${companyData.policies.breakTime}\n\n` +
           `Usa /registrar para marcar tu asistencia 📝`;
  }
  
  // Consultas sobre departamentos
  if (lowerMessage.includes('departamento') || lowerMessage.includes('área')) {
    return `🏢 *Departamentos de ${companyData.name}*\n\n` +
           companyData.departments.map(dept => `• ${dept}`).join('\n') + '\n\n' +
           `Para cambios de departamento, contacta a RRHH 📋`;
  }
  
  // Consultas sobre ubicación o donde registrar
  if (lowerMessage.includes('donde') || lowerMessage.includes('dónde') || lowerMessage.includes('ubicación')) {
    return '📍 *¿Dónde registrar asistencia?*\n\n' +
           '• **Aquí mismo** con este bot de Telegram\n' +
           '• En los **terminales** de la oficina\n' +
           '• Desde la **aplicación web** de TMAC\n' +
           '• Con **código QR** en los accesos\n\n' +
           '¡Elige el método que más te convenga! 😊';
  }
  
  // Consultas sobre faltas o ausencias
  if (lowerMessage.includes('falta') || lowerMessage.includes('ausencia') || lowerMessage.includes('no vine')) {
    return '⚠️ *Registro de Ausencias*\n\n' +
           '📋 **Para justificar faltas:**\n' +
           '1. Contacta a tu supervisor inmediato\n' +
           '2. Presenta documentación si es necesaria\n' +
           '3. Registra en el sistema de RRHH\n\n' +
           '⚠️ **Recuerda:** Las faltas injustificadas afectan tu expediente\n\n' +
           'Para más info: habla con Recursos Humanos 👥';
  }
  
  return null;
}

// Mostrar botones de asistencia al escribir /start, /registrar o cualquier mensaje que contenga 'registrar' o 'start'
const showAttendanceButtons = (ctx: any) => {
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🟢 Registrar Entrada', callback_data: 'entrada' },
        { text: '🔴 Registrar Salida', callback_data: 'salida' }
      ]
    ]
  };
  ctx.reply('Selecciona una opción:', {
    reply_markup: keyboard,
    parse_mode: 'Markdown'
  });
};

bot.start(showAttendanceButtons);
bot.command('registrar', showAttendanceButtons);
bot.hears(/registrar|start/i, showAttendanceButtons);

// Comando para ver estado actual
bot.command('estado', (ctx) => {
  // Aquí iría la lógica para consultar el estado del usuario
  const userId = ctx.from?.id;
  const userName = ctx.from?.first_name || 'Usuario';
  
  ctx.reply(
    `📊 *Estado Actual - ${userName}*\n\n` +
    `👤 Usuario: ${userName}\n` +
    `🆔 ID: ${userId}\n` +
    `⏰ Último registro: Pendiente de implementar\n` +
    `📍 Estado: Pendiente de implementar\n\n` +
    `_Esta información se conectará con la base de datos._`,
    { parse_mode: 'Markdown' }
  );
});

// Comando para ver historial
bot.command('historial', (ctx) => {
  ctx.reply(
    '📋 *Historial de Asistencias*\n\n' +
    '_Esta funcionalidad se conectará con la base de datos para mostrar:_\n\n' +
    '• Registros de los últimos 7 días\n' +
    '• Horarios de entrada y salida\n' +
    '• Total de horas trabajadas\n' +
    '• Días de ausencia\n\n' +
    '⚙️ Funcionalidad en desarrollo...',
    { parse_mode: 'Markdown' }
  );
});

// Comandos de texto inteligentes (reconocimiento de lenguaje natural)
bot.hears(/quiero registrar|registrar|entrada|salida|fichar|marcar/i, (ctx) => {
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🟢 Registrar Entrada', callback_data: 'entrada' },
        { text: '🔴 Registrar Salida', callback_data: 'salida' }
      ]
    ]
  };

  ctx.reply(
    '📋 *Perfecto! ¿Qué tipo de registro quieres hacer?*\n\n' +
    'Selecciona una opción:',
    {
      reply_markup: keyboard,
      parse_mode: 'Markdown'
    }
  );
});

// Comando para consulta de estado con lenguaje natural
bot.hears(/estado|como estoy|mi situacion|situación|status/i, (ctx) => {
  const userId = ctx.from?.id;
  const userName = ctx.from?.first_name || 'Usuario';
  
  ctx.reply(
    `📊 *Estado Actual - ${userName}*\n\n` +
    `👤 Usuario: ${userName}\n` +
    `🆔 ID Telegram: ${userId}\n` +
    `⏰ Último registro: Pendiente de implementar\n` +
    `📍 Estado actual: Pendiente de implementar\n` +
    `🕐 Horas trabajadas hoy: Pendiente de implementar\n\n` +
    `_Esta información se conectará con la base de datos._`,
    { parse_mode: 'Markdown' }
  );
});

// Comando para historial con lenguaje natural
bot.hears(/historial|historia|registros anteriores|mis registros/i, (ctx) => {
  ctx.reply(
    '📋 *Tu Historial de Asistencias*\n\n' +
    '_Esta funcionalidad se conectará con la base de datos para mostrar:_\n\n' +
    '📅 **Últimos 7 días:**\n' +
    '• Lunes: Entrada 08:15 - Salida 17:00\n' +
    '• Martes: Entrada 08:10 - Salida 17:05\n' +
    '• Miércoles: Entrada 08:20 - Salida 17:00\n' +
    '• Jueves: Entrada 08:12 - Salida 17:03\n' +
    '• Viernes: Entrada 08:18 - Salida 17:00\n\n' +
    '📊 **Resumen:**\n' +
    '• Total horas: 40h 00min\n' +
    '• Días completos: 5/5\n' +
    '• Promedio entrada: 08:15\n\n' +
    '⚙️ _Datos de ejemplo - Funcionalidad en desarrollo_',
    { parse_mode: 'Markdown' }
  );
});

// Guardar estado temporal de usuarios esperando ubicación
const pendingLocation: Record<number, { tipo: 'entrada' | 'salida', nombre: string }> = {};

// Modificar callback_query para pedir solo ubicación
bot.on('callback_query', async (ctx) => {
  const callbackData = 'data' in ctx.callbackQuery ? ctx.callbackQuery.data : null;
  const userName = ctx.from?.first_name || 'Usuario';
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  if (callbackData === 'entrada' || callbackData === 'salida') {
    pendingLocation[telegramId] = { tipo: callbackData, nombre: userName };
    await ctx.reply(
      'Para registrar tu ' + (callbackData === 'entrada' ? 'entrada' : 'salida') + ', es necesario que compartas tu ubicación actual.\n\n' +
      'Esto es una medida de control para validar que realmente te encuentras en el lugar de trabajo.',
      {
        reply_markup: {
          keyboard: [[{ text: '📍 Enviar ubicación', request_location: true }]],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      }
    );
    ctx.answerCbQuery();
    return;
  }
  const now = new Date();
  const timeString = now.toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  try {
    if (callbackData === 'iniciar_comida') {
      await iniciarComida(telegramId, userName);
      ctx.answerCbQuery('Hora de comida iniciada');
      ctx.reply('🍽️ ¡Hora de comida registrada! Disfruta tu descanso. Cuando regreses, pulsa "Regresar a trabajar".', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🔙 Regresar a trabajar', callback_data: 'regresar_trabajo' }
            ],
            [
              { text: '🏁 Registrar salida', callback_data: 'salida' }
            ]
          ]
        }
      });
    } else if (callbackData === 'regresar_trabajo') {
      await regresarTrabajo(telegramId, userName);
      ctx.answerCbQuery('Regreso de comida registrado');
      ctx.reply('🔙 ¡Bienvenido de vuelta! Puedes registrar tu salida cuando termines tu jornada.', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🏁 Registrar salida', callback_data: 'salida' }
            ]
          ]
        }
      });
    } else if (callbackData === 'salida') {
      await registrarSalida(telegramId, userName);
      ctx.answerCbQuery('🏁 Salida registrada correctamente');
      ctx.reply(
        `🏁 *¡Salida Registrada Exitosamente!*\n\n` +
        `👤 Empleado: ${userName}\n` +
        `⏰ Fecha y hora: ${timeString}\n` +
        `📍 Ubicación: Oficina Principal\n` +
        `🏢 Departamento: Por configurar\n\n` +
        `🎯 *Estado:* Fuera de servicio\n` +
        `⏱️ *Horas trabajadas hoy:* Por calcular\n\n` +
        `¡Que descanses! Nos vemos mañana 👋\n\n` +
        `_💾 Registro guardado en el sistema_`,
        { parse_mode: 'Markdown' }
      );
    }
  } catch (error) {
    ctx.reply('❌ Error al registrar la acción en la base de datos. Intenta de nuevo o contacta a soporte.');
  }
});

// ================= FLUJO DE REGISTRO DE ENTRADA/SALIDA CON UBICACIÓN =================
bot.on('location', async (ctx) => {
  const telegramId = ctx.from?.id;
  const userName = ctx.from?.first_name || 'Usuario';
  if (!telegramId || !pendingLocation[telegramId]) return;

  const { tipo, nombre } = pendingLocation[telegramId];
  const loc = ctx.message.location;
  const ubicacion = `${loc.latitude},${loc.longitude}`;

  try {
    if (tipo === 'entrada') {
      await registrarEntradaConUbicacion(telegramId, nombre, ubicacion);
      // Mensaje de confirmación (sin mostrar coordenadas)
      await ctx.reply('✅ Entrada registrada exitosamente.');
      // Mostrar opciones adicionales
      const nextActions = {
        inline_keyboard: [
          [{ text: '🍽️ Iniciar hora de comida', callback_data: 'iniciar_comida' }],
          [{ text: '🔙 Regresar a trabajar', callback_data: 'regresar_trabajo' }],
          [{ text: '🏁 Registrar salida', callback_data: 'salida' }]
        ]
      };
      // Añadir mensaje con botones
      await ctx.reply(
        '¿Qué deseas hacer a continuación?',
        { reply_markup: nextActions }
      );
    } else if (tipo === 'salida') {
      await registrarSalidaConUbicacion(telegramId, nombre, ubicacion);
      // Mensaje de confirmación y sugerencia de descanso
      await ctx.reply(
        '🏁 Salida registrada con ubicación.\n\n¡Que descanses! Nos vemos mañana 👋 ,recuerda de escribir "registrar" para que se registre tu entrada correctamente el día de mañana.',
        { parse_mode: 'Markdown' }
      );
    }
  } catch (e) {
    await ctx.reply('❌ Error al registrar: ' + (e instanceof Error ? e.message : ''));
  } finally {
    delete pendingLocation[telegramId];
  }
});
// ================= FIN FLUJO DE REGISTRO DE ENTRADA/SALIDA CON UBICACIÓN =================

// Manejar mensajes de texto con IA simple
bot.on('text', (ctx) => {
  const message = ctx.message.text;
  const intelligentResponse = processIntelligentMessage(message);
  
  if (intelligentResponse) {
    ctx.reply(intelligentResponse, { parse_mode: 'Markdown' });
  } else {
    // Respuesta por defecto más amigable
    const defaultResponses = [
      '🤔 No estoy seguro de entender esa consulta.',
      '🤖 Mmm, no reconozco ese comando.',
      '💭 No comprendo completamente tu mensaje.',
      '🔍 No tengo información sobre eso.'
    ];
    
    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    
    ctx.reply(
      `${randomResponse}\n\n` +
      '💡 **Sugerencias:**\n' +
      '• Usa /ayuda para ver todos los comandos\n' +
      '• Intenta con "/registrar" para marcar asistencia\n' +
      '• Escribe "hola" para un saludo\n' +
      '• Pregunta sobre "horarios" para información\n\n' +
      '_Estoy en constante aprendizaje para servirte mejor_ 🤖✨'
    );
  }
});

  return bot;
}

// Exportar la función para crear el bot
let botInstance: Telegraf | null = null;

export default function getBot() {
  if (!botInstance) {
    botInstance = createBot();
  }
  return botInstance;
}