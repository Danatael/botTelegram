"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, User, CheckCircle } from "lucide-react"
import { TelegramBotIntegration } from "@/components/telegram-bot-integration"
import { QRScanner } from "@/components/qr-scanner"
import { AttendanceForm } from "@/components/attendance-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"

export default function WitmacBot() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeView, setActiveView] = useState<"chat" | "qr" | "manual">("chat")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header similar a Telegram */}
      <header className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Witmac Asistencia</h1>
              <p className="text-blue-200 text-sm">Bot de Registro</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <BarChart3 className="w-4 h-4 mr-1 text-white" />
                Dashboard
              </Button>
            </Link>
            <div className="text-right">
              <div className="text-sm font-mono text-white">{currentTime.toLocaleTimeString("es-MX")}</div>
              <div className="text-xs text-blue-200">{currentTime.toLocaleDateString("es-MX")}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-md mx-auto bg-black text-white min-h-[calc(100vh-80px)] shadow-xl">
        {activeView === "chat" && <TelegramBotIntegration />}
        {activeView === "qr" && <QRScanner onBack={() => setActiveView("chat")} />}
        {activeView === "manual" && <AttendanceForm onBack={() => setActiveView("chat")} />}
      </main>

      {/* Status bar inferior */}
      <div className="max-w-md mx-auto bg-black border-t border-gray-700 p-2">
        <div className="flex justify-center items-center gap-4 text-xs text-gray-200">
          <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-300">
            <CheckCircle className="w-3 h-3 text-green-400" />
            Sistema Activo
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 border-blue-500 text-blue-300">
            <Clock className="w-3 h-3 text-blue-400" />
            Horario Laboral
          </Badge>
        </div>
      </div>
    </div>
  )
}
