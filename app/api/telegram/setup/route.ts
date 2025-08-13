import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { webhookUrl } = await request.json();
    
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('Token del bot no configurado');
    }

    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl || `${process.env.TELEGRAM_WEBHOOK_URL}`,
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return NextResponse.json({
        success: true,
        message: 'Webhook configurado exitosamente',
        data: data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Error al configurar webhook',
        error: data
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error configurando webhook:', error);
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('Token del bot no configurado');
    }

    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getWebhookInfo`;
    
    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json({
      success: true,
      webhookInfo: data.result
    });

  } catch (error) {
    console.error('Error obteniendo info del webhook:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al obtener información del webhook',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
