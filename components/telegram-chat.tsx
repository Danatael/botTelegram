"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { QrCode, Edit3, Clock, MapPin } from "lucide-react"

interface Message {
  id: number
  type: "bot" | "user"
  content: string
  timestamp: Date
  actions?: Array<{
    label: string
    action: string
    icon?: React.ReactNode
  }>
}

interface TelegramChatProps {
  onViewChange: (view: "chat" | "qr" | "manual") => void
}

export function TelegramChat({ onViewChange }: TelegramChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Mensaje de bienvenida inicial
    const welcomeMessage: Message = {
      id: 1,
      type: "bot",
      content:
        "¡Hola! Bienvenido al sistema de registro de asistencia de Witmac. ¿Cómo te gustaría registrar tu asistencia hoy?",
      timestamp: new Date(),
      actions: [
        {
          label: "Escanear QR",
          action: "qr",
          icon: <QrCode className="w-4 h-4" />,
        },
        {
          label: "Registro Manual",
          action: "manual",
          icon: <Edit3 className="w-4 h-4" />,
        },
      ],
    }

    setMessages([welcomeMessage])
  }, [])

  const handleAction = (action: string) => {
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: action === "qr" ? "Quiero escanear mi código QR" : "Prefiero registro manual",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simular respuesta del bot
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content:
          action === "qr"
            ? "Perfecto. Te voy a abrir el escáner de códigos QR. Asegúrate de tener buena iluminación."
            : "Entendido. Te voy a mostrar el formulario de registro manual. Necesitarás tu código de empleado.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)

      // Cambiar vista después de un momento
      setTimeout(() => {
        onViewChange(action as "qr" | "manual")
      }, 1500)
    }, 2000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.type === "user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-gray-100 text-gray-800 rounded-bl-md"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                  {message.timestamp.toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Botones de acción */}
              {message.actions && (
                <div className="mt-3 space-y-2">
                  {message.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2 bg-white hover:bg-gray-50"
                      onClick={() => handleAction(action.action)}
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Indicador de escritura */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">Witmac Bot está escribiendo...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Información del sistema */}
      <div className="border-t bg-gray-50 p-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Turno: 08:00 - 17:00</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>Ubicación requerida</span>
          </div>
        </div>
      </div>
    </div>
  )
}
