import dotenv from 'dotenv';
import getBot from '@/lib/telegram-bot';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

async function startBot() {
  try {
    console.log('🤖 Iniciando Bot de Telegram...');
    console.log('🔑 Token configurado:', process.env.TELEGRAM_BOT_TOKEN ? 'Sí ✅' : 'No ❌');
    
    // Obtener la instancia del bot
    const bot = getBot();
    
    // Iniciar el bot en modo polling para desarrollo
    await bot.launch();
    
    console.log('✅ Bot iniciado exitosamente');
    console.log('📱 Bot disponible en: https://t.me/AsistenciasTmac_bot');
    console.log('🔧 Modo: Desarrollo (Polling)');
    console.log('💡 Tip: Prueba comandos como /start, /registrar, "hola", etc.');
    
    // Manejar cierre graceful
    process.once('SIGINT', () => {
      console.log('🛑 Deteniendo bot...');
      bot.stop('SIGINT');
    });
    process.once('SIGTERM', () => {
      console.log('🛑 Deteniendo bot...');
      bot.stop('SIGTERM');
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el bot:', error);
    process.exit(1);
  }
}

// Solo ejecutar si es llamado directamente
if (require.main === module) {
  startBot();
}

export { startBot };
