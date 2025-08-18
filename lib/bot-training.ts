// Configuración avanzada para el entrenamiento del bot
export interface BotTraining {
  patterns: string[];
  responses: string[];
  category: string;
}

export const botTrainingData: BotTraining[] = [
  // Saludos y cortesía
  {
    category: 'saludos',
    patterns: [
      'hola', 'hello', 'hi', 'buenos días', 'buenas tardes', 'buenas noches',
      'que tal', 'cómo estás', 'hey', 'saludos'
    ],
    responses: [
      '¡Hola! 👋 ¿En qué puedo ayudarte hoy?',
      '¡Buenos días! ¿Listo para registrar tu asistencia? 😊',
      '¡Hola! Soy tu asistente de TMAC. ¿Qué necesitas?',
      '¡Hey! ¿Vienes a registrar tu entrada o salida? 🕐'
    ]
  },

  // Despedidas
  {
    category: 'despedidas',
    patterns: [
      'adiós', 'bye', 'hasta luego', 'nos vemos', 'chao', 'gracias',
      'hasta mañana', 'me voy', 'hasta pronto'
    ],
    responses: [
      '¡Hasta luego! 👋 Que tengas un excelente día.',
      '¡Nos vemos! No olvides registrar tu salida 😉',
      '¡Hasta mañana! Descansa bien 🌙',
      '¡Adiós! Fue un placer ayudarte hoy ✨'
    ]
  },

  // Problemas técnicos
  {
    category: 'problemas',
    patterns: [
      'no funciona', 'error', 'problema', 'falla', 'bug', 'no responde',
      'está roto', 'no sirve', 'ayuda técnica'
    ],
    responses: [
      '🔧 Entiendo que tienes un problema técnico. Prueba reiniciar con /start',
      '⚠️ Si hay errores, contacta a IT. Mientras tanto, intenta /registrar',
      '🛠️ Los problemas técnicos se reportan a soporte. ¿Puedo ayudarte con algo más?',
      '💻 Para problemas del sistema, habla con tu supervisor de IT'
    ]
  },

  // Consultas sobre empleados
  {
    category: 'empleados',
    patterns: [
      'soy nuevo', 'primer día', 'no tengo cuenta', 'registrarme',
      'crear cuenta', 'alta empleado', 'código empleado'
    ],
    responses: [
      '🆕 ¡Bienvenido a TMAC! Para empleados nuevos, contacta a RRHH para tu código',
      '👤 Los nuevos empleados deben registrarse primero en RRHH',
      '📋 Necesitas tu código de empleado. Lo obtienes en Recursos Humanos',
      '✨ ¡Primer día! Habla con tu supervisor para configurar tu acceso'
    ]
  },

  // Horarios y políticas
  {
    category: 'politicas',
    patterns: [
      'política', 'reglas', 'normas', 'reglamento', 'tolerancia',
      'llegada tarde', 'falta', 'permiso', 'vacaciones'
    ],
    responses: [
      '📋 Para políticas de asistencia, consulta el manual del empleado',
      '⏰ Tolerancia de entrada: 15 minutos. Más info con RRHH',
      '📚 Las normas están en el portal del empleado',
      '🏢 Para permisos y faltas, habla con tu supervisor directo'
    ]
  },

  // Tecnología y funciones
  {
    category: 'funciones',
    patterns: [
      'qué puedes hacer', 'funciones', 'comandos', 'capacidades',
      'para qué sirves', 'cómo funciona', 'qué haces'
    ],
    responses: [
      '🤖 Puedo ayudarte a registrar asistencia, consultar horarios y más. Usa /ayuda',
      '⚡ Mis funciones: registro de entrada/salida, consultas de estado y historial',
      '📋 Soy tu asistente para control de asistencias. ¿Qué necesitas hacer?',
      '🎯 Especialista en asistencias: registro, consultas y reportes'
    ]
  }
];

// Función para obtener respuesta aleatoria de una categoría
export function getRandomResponse(category: string): string | null {
  const categoryData = botTrainingData.find(data => data.category === category);
  if (!categoryData) return null;
  
  const randomIndex = Math.floor(Math.random() * categoryData.responses.length);
  return categoryData.responses[randomIndex];
}

// Función para buscar patrones en el texto
export function findMatchingCategory(text: string): string | null {
  const lowerText = text.toLowerCase();
  
  for (const trainingData of botTrainingData) {
    for (const pattern of trainingData.patterns) {
      if (lowerText.includes(pattern.toLowerCase())) {
        return trainingData.category;
      }
    }
  }
  
  return null;
}

// Respuestas contextuales por hora del día
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return '🌅 ¡Buenos días! ¿Listo para empezar el día?';
  } else if (hour >= 12 && hour < 18) {
    return '☀️ ¡Buenas tardes! ¿Cómo va tu jornada?';
  } else if (hour >= 18 && hour < 22) {
    return '🌆 ¡Buenas tardes! ¿Ya terminaste tu jornada?';
  } else {
    return '🌙 ¡Buenas noches! Trabajas hasta tarde, ¿eh?';
  }
}

// Datos de la empresa para respuestas contextuales
export const companyData = {
  name: 'TMAC',
  workingHours: {
    start: '08:00',
    end: '17:00',
    lunch: '12:00-13:00'
  },
  departments: [
    'Administración',
    'Recursos Humanos',
    'IT/Sistemas',
    'Operaciones',
    'Ventas',
    'Contabilidad'
  ],
  policies: {
    tolerance: '15 minutos',
    breakTime: '15 minutos por la mañana y tarde',
    lunchTime: '60 minutos'
  }
};
