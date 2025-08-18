import { NextRequest, NextResponse } from 'next/server';
import getBot from '@/lib/telegram-bot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Obtener instancia del bot y procesar la actualización
    const bot = getBot();
    await bot.handleUpdate(body);
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error en webhook de Telegram:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Webhook de Telegram funcionando',
    bot: 'AsistenciasTmac_bot',
    status: 'activo'
  });
}
