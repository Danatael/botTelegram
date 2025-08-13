# Bot de Asistencias TMAC - Telegram Bot

Este proyecto integra un bot de Telegram para el sistema de asistencias de TMAC.

## 🤖 Bot de Telegram

**Nombre:** @AsistenciasTmac_bot  
**Enlace:** [https://t.me/AsistenciasTmac_bot](https://t.me/AsistenciasTmac_bot)

### Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `/start` | Mensaje de bienvenida e introducción |
| `/registrar` | Registrar entrada o salida |
| `/estado` | Ver estado actual de asistencia |
| `/historial` | Ver historial de asistencias |
| `/ayuda` | Mostrar ayuda y comandos |

## 🛠️ Configuración

### Variables de Entorno

Asegúrate de tener las siguientes variables en tu archivo `.env.local`:

```env
TELEGRAM_BOT_TOKEN=8412689602:AAHuIuGBzUux0xFJ0rpLOT741xsezG0L-9k
TELEGRAM_WEBHOOK_URL=http://localhost:3000/api/telegram/webhook
TELEGRAM_WEBHOOK_SECRET=tu_secreto_aqui_cambialo_por_uno_seguro
```

### Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

3. (Opcional) Iniciar el bot en modo polling para desarrollo:
```bash
npm run bot:dev
```

## 📡 Endpoints API

### Webhook del Bot
- **URL:** `/api/telegram/webhook`
- **Método:** POST
- **Descripción:** Recibe actualizaciones del bot de Telegram

### Configuración del Webhook
- **URL:** `/api/telegram/setup`
- **Métodos:** GET, POST
- **Descripción:** Configura y obtiene información del webhook

## 🔧 Administración

Accede a la página de administración del bot:
```
http://localhost:3000/admin/telegram
```

Desde ahí puedes:
- Ver el estado del bot
- Configurar el webhook
- Probar los comandos
- Ver información de configuración

## 🚀 Despliegue en Producción

### 1. Configurar el Webhook

Una vez que tengas tu aplicación desplegada, configura el webhook:

```bash
curl -X POST https://api.telegram.org/bot8412689602:AAHuIuGBzUux0xFJ0rpLOT741xsezG0L-9k/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://tu-dominio.com/api/telegram/webhook"}'
```

### 2. Variables de Entorno en Producción

```env
TELEGRAM_BOT_TOKEN=8412689602:AAHuIuGBzUux0xFJ0rpLOT741xsezG0L-9k
TELEGRAM_WEBHOOK_URL=https://tu-dominio.com/api/telegram/webhook
TELEGRAM_WEBHOOK_SECRET=un_secreto_muy_seguro_para_produccion
```

## 🔗 Integración con la Aplicación

El bot está integrado en:

1. **Componente de Chat:** `components/telegram-chat.tsx`
   - Incluye botón para abrir el bot de Telegram
   - Muestra información del bot

2. **Dashboard:** Accesible desde la interfaz principal
   - Opción "Abrir Bot de Telegram" en el chat

3. **Administración:** Página dedicada para configurar el bot
   - Configuración de webhook
   - Estado del bot
   - Comandos disponibles

## 📱 Funcionalidades del Bot

### Registro de Asistencia
- Botones interactivos para entrada/salida
- Confirmación con timestamp
- Información de ubicación (pendiente)

### Estado y Historial
- Consulta de estado actual
- Historial de registros (pendiente implementación con BD)
- Información del usuario

### Experiencia de Usuario
- Interfaz intuitiva con botones
- Mensajes formateados con Markdown
- Respuestas rápidas y confirmaciones

## 🛡️ Seguridad

- Token del bot almacenado en variables de entorno
- Validación de webhooks (recomendado implementar)
- Manejo de errores y excepciones

## 📚 Próximas Funcionalidades

- [ ] Integración con base de datos
- [ ] Autenticación de usuarios
- [ ] Geolocalización para registro
- [ ] Reportes y estadísticas
- [ ] Notificaciones automáticas
- [ ] Integración con sistemas de RRHH

## 🐛 Solución de Problemas

### Bot no responde
1. Verificar que el token sea correcto
2. Comprobar que el webhook esté configurado
3. Revisar logs del servidor

### Webhook no funciona
1. Verificar que la URL sea accesible públicamente
2. Comprobar certificado SSL (requerido para webhooks)
3. Revisar configuración en Telegram

### Errores de desarrollo
1. Usar modo polling con `npm run bot:dev`
2. Verificar variables de entorno
3. Comprobar conectividad a internet

## 📞 Soporte

Para soporte técnico o reportar problemas:
1. Revisar la documentación de Telegram Bot API
2. Verificar logs de la aplicación
3. Contactar al equipo de desarrollo
