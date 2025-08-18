"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bot, ExternalLink, MessageCircle, ArrowRight } from "lucide-react"

export function TelegramBotIntegration() {
  const botUsername = "AsistenciasTmac_bot"
  const botUrl = `https://t.me/${botUsername}`

  const openTelegramBot = () => {
    window.open(botUrl, "_blank")
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      
      {/* Header del Bot */}
      <div className="bg-blue-600 text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold">Bot de Asistencias TMAC</h2>
          <p className="text-blue-100 text-sm">@{botUsername}</p>
        </div>
        <div className="flex items-center gap-1 text-green-300">
          <div className="w-2 h-2 bg-green-300 rounded-full"></div>
          <span className="text-xs">En línea</span>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 bg-gray-50 p-6 flex flex-col items-center justify-center">
        
        {/* Mensaje de Bienvenida */}
        <div className="bg-white rounded-2xl rounded-bl-md p-4 mb-6 max-w-xs shadow-sm">
          <p className="text-sm text-gray-800">
            ¡Hola! 👋 Soy el Bot de Asistencias TMAC. 
            
            Para usar todas mis funciones, necesitas abrir la conversación en Telegram.
          </p>
          <div className="text-xs text-gray-500 mt-2">
            {new Date().toLocaleTimeString("es-MX", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Botón Principal */}
        <Button 
          onClick={openTelegramBot}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 shadow-lg mb-4"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Continuar en Telegram
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Funcionalidades */}
        <div className="text-center space-y-3">
          <p className="text-sm font-medium text-gray-700">Funcionalidades disponibles:</p>
          <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>/registrar - Registrar entrada o salida</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>/estado - Ver tu estado actual</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>/historial - Ver historial completo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span>/ayuda - Obtener ayuda</span>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-xs">
          <p className="text-xs text-yellow-800 font-medium mb-1">💡 Tip:</p>
          <p className="text-xs text-yellow-700">
            Una vez en Telegram, escribe <code className="bg-yellow-200 px-1 rounded">/start</code> para comenzar
          </p>
        </div>
      </div>

      {/* Footer con enlace directo */}
      <div className="bg-white border-t p-3 text-center">
        <p className="text-xs text-gray-500 mb-2">
          ¿No tienes Telegram instalado?
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open("https://telegram.org/", "_blank")}
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Descargar Telegram
        </Button>
      </div>
    </div>
  )
}
