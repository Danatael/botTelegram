# 🤖 Guía de Entrenamiento del Bot de Telegram

Esta guía te enseña cómo entrenar y personalizar tu bot de Telegram para que responda de manera más inteligente y específica a las necesidades de tu empresa.

## 📚 Sistema de Entrenamiento

### 1. Archivo de Entrenamiento (`lib/bot-training.ts`)

El bot utiliza un sistema de patrones y respuestas que puedes personalizar:

```typescript
{
  category: 'saludos',
  patterns: ['hola', 'buenos días', 'buenas tardes'],
  responses: [
    '¡Hola! 👋 ¿En qué puedo ayudarte hoy?',
    '¡Buenos días! ¿Listo para registrar tu asistencia? 😊'
  ]
}
```

### 2. Categorías Disponibles

- **saludos**: Respuestas a saludos y cortesías
- **despedidas**: Respuestas de despedida
- **problemas**: Manejo de errores y problemas técnicos
- **empleados**: Información para empleados nuevos
- **politicas**: Reglas y normativas de la empresa
- **funciones**: Capacidades del bot

## 🛠️ Cómo Agregar Nuevas Respuestas

### Paso 1: Editar el archivo de entrenamiento

```typescript
// Agregar nueva categoría en bot-training.ts
{
  category: 'vacaciones',
  patterns: [
    'vacaciones', 'días libres', 'permiso', 'ausencia programada',
    'solicitar días', 'tiempo libre'
  ],
  responses: [
    '🏖️ Para solicitar vacaciones, contacta a RRHH con 15 días de anticipación',
    '📅 Las vacaciones se aprueban según disponibilidad del departamento',
    '🗓️ Recuerda que tienes derecho a X días de vacaciones al año'
  ]
}
```

### Paso 2: Agregar lógica específica (opcional)

En `telegram-bot.ts`, puedes agregar lógica más compleja:

```typescript
// Dentro de processIntelligentMessage()
if (lowerMessage.includes('vacaciones') || lowerMessage.includes('permiso')) {
  return `🏖️ *Solicitud de Vacaciones*\n\n` +
         `📋 **Proceso:**\n` +
         `1. Solicita con 15 días de anticipación\n` +
         `2. Llena el formulario en RRHH\n` +
         `3. Espera aprobación del supervisor\n\n` +
         `💼 Tienes ${diasVacacionesDisponibles} días disponibles`;
}
```

## 🎯 Tipos de Entrenamiento

### 1. Reconocimiento de Patrones Simple
- El bot busca palabras clave en los mensajes
- Responde con una respuesta aleatoria de la categoría

### 2. Respuestas Contextuales
- Basadas en la hora del día
- Información específica de la empresa
- Estado del usuario

### 3. Respuestas Dinámicas
- Incluyen el nombre del usuario
- Fechas y horas actuales
- Datos calculados en tiempo real

## 📝 Ejemplos de Entrenamiento Avanzado

### Manejo de Errores Específicos
```typescript
if (lowerMessage.includes('no puedo entrar') || lowerMessage.includes('sistema caído')) {
  return '🚨 *Problema del Sistema*\n\n' +
         '⚠️ Si el sistema está caído:\n' +
         '1. Anota tu hora de entrada manualmente\n' +
         '2. Reporta a IT inmediatamente\n' +
         '3. Registra cuando se restaure el servicio\n\n' +
         '📞 IT: extensión 123';
}
```

### Información Específica de Departamentos
```typescript
if (lowerMessage.includes('mi departamento')) {
  const userDept = getUserDepartment(ctx.from?.id); // Función personalizada
  return `🏢 **Tu Departamento: ${userDept}**\n\n` +
         `👥 Supervisor: ${getSupervisor(userDept)}\n` +
         `⏰ Horario especial: ${getDeptSchedule(userDept)}\n` +
         `📍 Ubicación: ${getDeptLocation(userDept)}`;
}
```

## 🔧 Configuración de la Empresa

Edita los datos en `bot-training.ts`:

```typescript
export const companyData = {
  name: 'TU_EMPRESA',
  workingHours: {
    start: '09:00',  // Cambiar según tu horario
    end: '18:00',
    lunch: '13:00-14:00'
  },
  departments: [
    'Tu Departamento 1',
    'Tu Departamento 2'
    // Agregar todos tus departamentos
  ],
  policies: {
    tolerance: '10 minutos',  // Cambiar según tu política
    breakTime: '15 minutos por la mañana y tarde',
    lunchTime: '60 minutos'
  }
};
```

## 🚀 Comandos Inteligentes con Expresiones Regulares

### Registro de Asistencia por Texto
```typescript
bot.hears(/quiero registrar|registrar|entrada|salida|fichar|marcar/i, (ctx) => {
  // Lógica para mostrar opciones de registro
});
```

### Consulta de Estado
```typescript
bot.hears(/estado|como estoy|mi situacion|status/i, (ctx) => {
  // Lógica para mostrar estado actual
});
```

## 📊 Mejores Prácticas

### 1. Usa Respuestas Variadas
- Agrega múltiples respuestas para cada patrón
- Evita respuestas repetitivas

### 2. Sé Específico
- Incluye información útil de tu empresa
- Proporciona pasos claros de acción

### 3. Mantén Consistencia
- Usa el mismo tono y estilo
- Incluye emojis para mejor UX

### 4. Actualiza Regularmente
- Agrega nuevos patrones según preguntas frecuentes
- Mejora respuestas basado en feedback

## 🎮 Comandos de Desarrollo

### Probar el Bot Localmente
```bash
npm run bot:dev  # Modo desarrollo con auto-reload
```

### Probar Respuestas
```bash
# En Telegram, envía mensajes como:
"hola"
"quiero registrar mi entrada"
"¿cuál es mi horario?"
"tengo un problema"
```

## 📈 Monitoreo y Mejoras

### 1. Logs de Conversaciones
Agrega logging para analizar preguntas frecuentes:

```typescript
bot.on('text', (ctx) => {
  console.log(`Usuario ${ctx.from?.id}: ${ctx.message.text}`);
  // Tu lógica aquí
});
```

### 2. Métricas de Uso
- Comandos más utilizados
- Preguntas sin respuesta
- Errores frecuentes

### 3. Feedback de Usuarios
Agrega botones para calificar respuestas:

```typescript
const feedbackKeyboard = {
  inline_keyboard: [
    [
      { text: '👍 Útil', callback_data: 'feedback_good' },
      { text: '👎 No útil', callback_data: 'feedback_bad' }
    ]
  ]
};
```

## 🔮 Próximas Funcionalidades

- [ ] Integración con base de datos para respuestas personalizadas
- [ ] Sistema de aprendizaje automático
- [ ] Integración con APIs externas (clima, noticias, etc.)
- [ ] Notificaciones programadas
- [ ] Reportes automáticos

## 🆘 Solución de Problemas

### El bot no responde a ciertos patrones
1. Verifica que los patrones estén en minúsculas
2. Asegúrate de usar `includes()` correctamente
3. Revisa los logs para errores

### Respuestas inconsistentes
1. Verifica el orden de los `if` statements
2. Asegúrate de no tener patrones conflictivos
3. Usa `else if` cuando sea apropiado

### Rendimiento lento
1. Optimiza las expresiones regulares
2. Limita el número de patrones por categoría
3. Usa caché para respuestas frecuentes

---

¡Con esta guía puedes entrenar tu bot para que sea un asistente verdaderamente útil para tu empresa! 🚀
