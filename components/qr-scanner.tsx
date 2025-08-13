"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, QrCode, CheckCircle, AlertCircle, Camera } from "lucide-react"

interface QRScannerProps {
  onBack: () => void
}

export function QRScanner({ onBack }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null)
  const [employeeData, setEmployeeData] = useState<any>(null)

  const handleScan = () => {
    setIsScanning(true)

    // Simular escaneo
    setTimeout(() => {
      setIsScanning(false)
      // Simular resultado exitoso (en producción sería aleatorio o basado en QR real)
      setScanResult("success")
      setEmployeeData({
        id: "EMP001",
        name: "Juan Pérez",
        department: "Campo - Zona Norte",
        shift: "08:00 - 17:00",
        location: "Obra Central",
      })
    }, 3000)
  }

  const handleConfirm = () => {
    // Aquí se enviaría la información al servidor
    alert("Asistencia registrada exitosamente")
    onBack()
  }

  return (
    <div className="p-4 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold">Escanear Código QR</h2>
      </div>

      {!scanResult ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          {/* Área de escaneo */}
          <div className="relative">
            <div className="w-64 h-64 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center bg-blue-50">
              {isScanning ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-blue-600 font-medium">Escaneando...</p>
                  <p className="text-sm text-gray-500 mt-1">Mantén el código QR centrado</p>
                </div>
              ) : (
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-600">Posiciona tu código QR aquí</p>
                </div>
              )}
            </div>

            {/* Esquinas del escáner */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-600 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-600 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-600 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-600 rounded-br-lg"></div>
          </div>

          {/* Instrucciones */}
          <div className="text-center space-y-2">
            <p className="text-gray-700">Coloca tu código QR dentro del marco</p>
            <p className="text-sm text-gray-500">Asegúrate de tener buena iluminación</p>
          </div>

          {/* Botón de escaneo */}
          <Button onClick={handleScan} disabled={isScanning} className="w-full max-w-xs" size="lg">
            <Camera className="w-5 h-5 mr-2" />
            {isScanning ? "Escaneando..." : "Iniciar Escaneo"}
          </Button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center space-y-6">
          {scanResult === "success" ? (
            <>
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-700 mb-2">¡Código Escaneado!</h3>
                <p className="text-gray-600">Información del empleado verificada</p>
              </div>

              <Card className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Empleado:</span>
                  <span className="font-medium">{employeeData?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-medium">{employeeData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departamento:</span>
                  <span className="font-medium">{employeeData?.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horario:</span>
                  <span className="font-medium">{employeeData?.shift}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ubicación:</span>
                  <span className="font-medium">{employeeData?.location}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Hora de Registro:</span>
                  <span className="font-medium text-blue-600">{new Date().toLocaleTimeString("es-MX")}</span>
                </div>
              </Card>

              <div className="space-y-3">
                <Button onClick={handleConfirm} className="w-full" size="lg">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmar Asistencia
                </Button>
                <Button variant="outline" onClick={onBack} className="w-full bg-transparent">
                  Cancelar
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-700 mb-2">Error de Escaneo</h3>
                <p className="text-gray-600">No se pudo leer el código QR</p>
              </div>

              <div className="space-y-3">
                <Button onClick={() => setScanResult(null)} className="w-full" size="lg">
                  Intentar de Nuevo
                </Button>
                <Button variant="outline" onClick={onBack} className="w-full bg-transparent">
                  Volver al Chat
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
