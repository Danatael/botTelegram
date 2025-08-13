"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Clock, MapPin, CheckCircle } from "lucide-react"

interface AttendanceFormProps {
  onBack: () => void
}

export function AttendanceForm({ onBack }: AttendanceFormProps) {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    department: "",
    location: "",
    attendanceType: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (submitted) {
    return (
      <div className="p-4 h-[calc(100vh-140px)] flex flex-col justify-center items-center space-y-6">
        <CheckCircle className="w-20 h-20 text-green-500" />
        <div className="text-center">
          <h3 className="text-xl font-semibold text-green-700 mb-2">¡Asistencia Registrada!</h3>
          <p className="text-gray-600">Tu registro ha sido enviado exitosamente</p>
        </div>

        <Card className="w-full p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Empleado:</span>
            <span className="font-medium">{formData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ID:</span>
            <span className="font-medium">{formData.employeeId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Hora:</span>
            <span className="font-medium text-blue-600">{new Date().toLocaleTimeString("es-MX")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tipo:</span>
            <span className="font-medium">{formData.attendanceType}</span>
          </div>
        </Card>

        <Button onClick={onBack} className="w-full" size="lg">
          Volver al Chat
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold">Registro Manual</h2>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex-1 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="employeeId" className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              Código de Empleado
            </Label>
            <Input
              id="employeeId"
              placeholder="Ej: EMP001"
              value={formData.employeeId}
              onChange={(e) => handleInputChange("employeeId", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="name" className="mb-2 block">
              Nombre Completo
            </Label>
            <Input
              id="name"
              placeholder="Tu nombre completo"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="department" className="mb-2 block">
              Departamento
            </Label>
            <Select onValueChange={(value) => handleInputChange("department", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="campo-norte">Campo - Zona Norte</SelectItem>
                <SelectItem value="campo-sur">Campo - Zona Sur</SelectItem>
                <SelectItem value="campo-centro">Campo - Zona Centro</SelectItem>
                <SelectItem value="oficina">Oficina Central</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="supervision">Supervisión</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location" className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              Ubicación de Trabajo
            </Label>
            <Select onValueChange={(value) => handleInputChange("location", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="obra-central">Obra Central</SelectItem>
                <SelectItem value="obra-norte">Obra Norte</SelectItem>
                <SelectItem value="obra-sur">Obra Sur</SelectItem>
                <SelectItem value="oficina-principal">Oficina Principal</SelectItem>
                <SelectItem value="almacen">Almacén</SelectItem>
                <SelectItem value="campo-remoto">Campo Remoto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="attendanceType" className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              Tipo de Registro
            </Label>
            <Select onValueChange={(value) => handleInputChange("attendanceType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="salida">Salida</SelectItem>
                <SelectItem value="entrada-comida">Entrada de Comida</SelectItem>
                <SelectItem value="salida-comida">Salida de Comida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Información actual */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Información Actual</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Fecha:</span>
              <span className="text-blue-800 font-medium">{new Date().toLocaleDateString("es-MX")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Hora:</span>
              <span className="text-blue-800 font-medium">{new Date().toLocaleTimeString("es-MX")}</span>
            </div>
          </div>
        </Card>

        {/* Botones */}
        <div className="space-y-3 pt-4">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={
              isSubmitting ||
              !formData.employeeId ||
              !formData.name ||
              !formData.department ||
              !formData.location ||
              !formData.attendanceType
            }
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Registrando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Registrar Asistencia
              </>
            )}
          </Button>

          <Button variant="outline" onClick={onBack} className="w-full bg-transparent" disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
