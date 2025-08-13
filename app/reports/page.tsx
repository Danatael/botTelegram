"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Download,
  Calendar,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Shield,
  Calculator,
} from "lucide-react"
import Link from "next/link"
import { LegalComplianceReport } from "@/components/reports/legal-compliance-report"
import { OvertimeReport } from "@/components/reports/overtime-report"
import { AttendanceAudit } from "@/components/reports/attendance-audit"
import { WorkingHoursReport } from "@/components/reports/working-hours-report"

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month")
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async (reportType: string) => {
    setIsGenerating(true)
    setSelectedReport(reportType)

    // Simular generación de reporte
    setTimeout(() => {
      setIsGenerating(false)
      // En producción, aquí se descargaría el archivo
      alert(`Reporte ${reportType} generado exitosamente`)
    }, 3000)
  }

  const legalReports = [
    {
      id: "stps-compliance",
      title: "Reporte STPS - Cumplimiento Normativo",
      description: "Reporte oficial para la Secretaría del Trabajo y Previsión Social",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      requirements: [
        "Registro de asistencia diaria",
        "Cálculo de horas extras",
        "Días de descanso obligatorio",
        "Cumplimiento de jornada máxima",
      ],
    },
    {
      id: "overtime-analysis",
      title: "Análisis de Horas Extras",
      description: "Reporte detallado de horas extras según Art. 67 LFT",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      requirements: [
        "Máximo 3 horas extras diarias",
        "Máximo 3 veces por semana",
        "Pago doble las primeras 9 horas",
        "Pago triple después de 9 horas",
      ],
    },
    {
      id: "working-hours",
      title: "Control de Jornada Laboral",
      description: "Verificación de cumplimiento de jornada máxima (Art. 61 LFT)",
      icon: Calculator,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      requirements: [
        "Jornada diurna: máximo 8 horas",
        "Jornada nocturna: máximo 7 horas",
        "Jornada mixta: máximo 7.5 horas",
        "Descanso mínimo de 30 minutos",
      ],
    },
    {
      id: "attendance-audit",
      title: "Auditoría de Asistencia",
      description: "Reporte completo para inspecciones laborales",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      requirements: [
        "Registro cronológico completo",
        "Firmas digitales verificables",
        "Respaldo de ubicación GPS",
        "Trazabilidad de modificaciones",
      ],
    },
  ]

  if (selectedReport) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Generador de Reportes Legales</h1>
              <p className="text-gray-600 mt-1">Cumplimiento normativo - Secretaría del Trabajo</p>
            </div>
          </div>
        </header>

        <div className="p-6">
          {selectedReport === "stps-compliance" && <LegalComplianceReport period={selectedPeriod} />}
          {selectedReport === "overtime-analysis" && <OvertimeReport period={selectedPeriod} />}
          {selectedReport === "working-hours" && <WorkingHoursReport period={selectedPeriod} />}
          {selectedReport === "attendance-audit" && <AttendanceAudit period={selectedPeriod} />}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reportes de Cumplimiento Legal</h1>
              <p className="text-gray-600 mt-1">Secretaría del Trabajo y Previsión Social - México</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Normativa Actualizada 2024
          </Badge>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Configuración del período */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Configuración del Período de Reporte
            </CardTitle>
            <CardDescription>Selecciona el período para generar los reportes de cumplimiento legal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="period">Período de Análisis</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Mes Actual</SelectItem>
                    <SelectItem value="last-month">Mes Anterior</SelectItem>
                    <SelectItem value="current-quarter">Trimestre Actual</SelectItem>
                    <SelectItem value="last-quarter">Trimestre Anterior</SelectItem>
                    <SelectItem value="current-year">Año Actual</SelectItem>
                    <SelectItem value="custom">Período Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedPeriod === "custom" && (
                <>
                  <div>
                    <Label htmlFor="start-date">Fecha Inicio</Label>
                    <Input type="date" id="start-date" />
                  </div>
                  <div>
                    <Label htmlFor="end-date">Fecha Fin</Label>
                    <Input type="date" id="end-date" />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alertas de cumplimiento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Estado de Cumplimiento Normativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">95%</div>
                <div className="text-sm text-green-600">Cumplimiento General</div>
              </div>

              <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-700">3</div>
                <div className="text-sm text-yellow-600">Horas Extras Excesivas</div>
              </div>

              <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">45</div>
                <div className="text-sm text-blue-600">Empleados Monitoreados</div>
              </div>

              <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-700">2</div>
                <div className="text-sm text-red-600">Incidencias Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reportes disponibles */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Reportes Oficiales Disponibles</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {legalReports.map((report) => (
              <Card key={report.id} className={`${report.borderColor} border-2 hover:shadow-lg transition-shadow`}>
                <CardHeader className={report.bgColor}>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white`}>
                      <report.icon className={`w-6 h-6 ${report.color}`} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{report.title}</div>
                      <div className="text-sm text-gray-600 font-normal">{report.description}</div>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Requisitos Normativos:</h4>
                    <ul className="space-y-1">
                      {report.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button onClick={() => setSelectedReport(report.id)} className="flex-1" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Reporte
                    </Button>

                    <Button
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={isGenerating && selectedReport === report.id}
                      className="flex-1"
                    >
                      {isGenerating && selectedReport === report.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Generando...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Descargar PDF
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Información legal */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Shield className="w-5 h-5" />
              Marco Legal de Referencia
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Ley Federal del Trabajo</h4>
                <ul className="space-y-1">
                  <li>• Art. 61 - Duración máxima de la jornada</li>
                  <li>• Art. 67 - Horas extraordinarias</li>
                  <li>• Art. 69 - Descanso semanal</li>
                  <li>• Art. 132 - Obligaciones del patrón</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Normativas STPS</h4>
                <ul className="space-y-1">
                  <li>• NOM-035-STPS-2018 - Factores de riesgo psicosocial</li>
                  <li>• Reglamento de inspecciones laborales</li>
                  <li>• Criterios de cumplimiento normativo</li>
                  <li>• Formatos oficiales de registro</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
