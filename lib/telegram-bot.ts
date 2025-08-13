import { Telegraf } from 'telegraf';
import { 
  findMatchingCategory, 
  getRandomResponse, 
  getTimeBasedGreeting,
  companyData 
} from './bot-training';
import {
  registrarEntrada,
  iniciarComida,
  regresarTrabajo,
  registrarSalida
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
    return '� *¿Dónde registrar asistencia?*\n\n' +
           '• **Aquí mismo** con este bot de Telegram\n' +
           '• En los **terminales** de la oficina\n' +
           '• Desde la **aplicación web** de TMAC\n' +
           '• Con **código QR** en los accesos\n\n' +
           '¡Elige el método que más te convenga! 😊';
  }
  
  // Consultas sobre faltas o ausencias
  if (lowerMessage.includes('falta') || lowerMessage.includes('ausencia') || lowerMessage.includes('no vine')) {
    return '� *Registro de Ausencias*\n\n' +
           '📋 **Para justificar faltas:**\n' +
           '1. Contacta a tu supervisor inmediato\n' +
           '2. Presenta documentación si es necesaria\n' +
           '3. Registra en el sistema de RRHH\n\n' +
           '⚠️ **Recuerda:** Las faltas injustificadas afectan tu expediente\n\n' +
           'Para más info: habla con Recursos Humanos 👥';
  }
  
  return null;
}

// Comando de inicio mejorado con IA
bot.start((ctx) => {
  const userName = ctx.from?.first_name || 'Usuario';
  const timeBasedGreeting = getTimeBasedGreeting();
  
  const welcomeMessage = 
    `${timeBasedGreeting}\n\n` +
    `¡Hola **${userName}**! 👋 Bienvenido al Bot de Asistencias ${companyData.name}.\n\n` +
    '🤖 **Soy tu asistente virtual inteligente** para el control de asistencias.\n\n' +
    '*🎯 ¿Qué puedo hacer por ti?*\n' +
    '✅ Registrar tu entrada y salida\n' +
    '📊 Consultar tu estado actual\n' +
    '📋 Ver tu historial de asistencias\n' +
    '⏰ Información sobre horarios y políticas\n' +
    '❓ Responder tus preguntas en lenguaje natural\n\n' +
    '*📋 Comandos principales:*\n' +
    '• `/registrar` - Registrar asistencia\n' +
    '• `/estado` - Ver estado actual\n' +
    '• `/historial` - Ver historial\n' +
    '• `/ayuda` - Manual completo\n\n' +
    '💡 **¡Novedad!** También puedes escribirme en lenguaje natural:\n' +
    '• _"Hola, buenos días"_\n' +
    '• _"Quiero registrar mi entrada"_\n' +
    '• _"¿Cuál es mi horario?"_\n' +
    '• _"Olvidé marcar mi salida"_\n\n' +
    '🚀 **¡Comencemos!** ¿Qué necesitas hacer hoy?';

  ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
});

// Comando de ayuda mejorado
bot.help((ctx) => {
  const helpMessage = 
    '🤖 *Manual Completo - Bot de Asistencias TMAC*\n\n' +
    '*📋 COMANDOS PRINCIPALES*\n' +
    '• `/start` - Reiniciar conversación\n' +
    '• `/registrar` - Registrar entrada/salida\n' +
    '• `/estado` - Ver tu estado actual\n' +
    '• `/historial` - Ver historial completo\n' +
    '• `/ayuda` - Mostrar esta ayuda\n\n' +
    '*💬 LENGUAJE NATURAL*\n' +
    'También entiendo frases como:\n' +
    '• "Hola, buenos días"\n' +
    '• "Quiero registrar mi entrada"\n' +
    '• "¿Cuál es mi horario?"\n' +
    '• "Olvidé marcar mi salida"\n' +
    '• "Tengo un problema"\n\n' +
    '*⏰ HORARIOS LABORALES*\n' +
    '• Entrada: 08:00 - 08:30\n' +
    '• Almuerzo: 12:00 - 13:00\n' +
    '• Salida: 17:00 en adelante\n\n' +
    '*🆘 SOPORTE*\n' +
    'Si tienes problemas técnicos:\n' +
    '• Reinicia con /start\n' +
    '• Contacta a IT si persiste\n' +
    '• Para temas de RRHH, habla con tu supervisor\n\n' +
    '_Versión 1.0 - Desarrollado para TMAC_';

  ctx.reply(helpMessage, { parse_mode: 'Markdown' });
});

// Comando para registrar asistencia
bot.command('registrar', (ctx) => {
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🟢 Registrar Entrada', callback_data: 'entrada' },
        { text: '🔴 Registrar Salida', callback_data: 'salida' }
      ]
    ]
  };

  ctx.reply(
    '⏰ *Registro de Asistencia*\n\n' +
    'Selecciona el tipo de registro que deseas realizar:',
    {
      reply_markup: keyboard,
      parse_mode: 'Markdown'
    }
  );
});

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

// Manejar callbacks de botones mejorado
bot.on('callback_query', async (ctx) => {
  const callbackData = 'data' in ctx.callbackQuery ? ctx.callbackQuery.data : null;
  const userName = ctx.from?.first_name || 'Usuario';
  const telegramId = ctx.from?.id;
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
    if (callbackData === 'entrada') {
      await registrarEntrada(telegramId, userName);
      ctx.answerCbQuery();
      ctx.reply(
        `✅ *Entrada Registrada*\n\n` +
        `👤 ${userName}\n` +
        `⏰ ${timeString}\n` +
        `📍 Ubicación: Pendiente de implementar\n\n` +
        `_El registro se guardó en la base de datos._`,
        { parse_mode: 'Markdown' }
      );
      // Mostrar opciones adicionales
      const nextActions = {
        inline_keyboard: [
          [
            { text: '🍽️ Iniciar hora de comida', callback_data: 'iniciar_comida' }
          ],
          [
            { text: '🔙 Regresar a trabajar', callback_data: 'regresar_trabajo' }
          ],
          [
            { text: '🏁 Registrar salida', callback_data: 'salida' }
          ]
        ]
      };
      ctx.reply('¿Qué deseas hacer a continuación?', { reply_markup: nextActions });
    } else if (callbackData === 'iniciar_comida') {
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

// Manejar nuevas acciones de comida y regreso
type NextAction = 'iniciar_comida' | 'regresar_trabajo';
bot.action('iniciar_comida', (ctx) => {
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
});
bot.action('regresar_trabajo', (ctx) => {
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
});

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
