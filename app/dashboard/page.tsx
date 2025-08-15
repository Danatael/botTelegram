"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, Clock, TrendingUp, Download, Filter, FileText, Shield, Bell } from "lucide-react"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { DepartmentChart } from "@/components/dashboard/department-chart"
import { ComplianceChart } from "@/components/dashboard/compliance-chart"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { AttendanceTable } from "@/components/dashboard/attendance-table"
import { RegistrosRecientesCard } from "@/components/dashboard/registros-recientes-card"
import Link from "next/link"

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("7d")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Asistencia - Witmac</h1>
            <p className="text-gray-600 mt-1">Panel de control y análisis histórico</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Sistema Activo
            </Badge>
            <Link href="/notifications">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notificaciones
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Reportes Legales
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros de Análisis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Último día</SelectItem>
                    <SelectItem value="7d">Últimos 7 días</SelectItem>
                    <SelectItem value="30d">Últimos 30 días</SelectItem>
                    <SelectItem value="90d">Últimos 3 meses</SelectItem>
                    <SelectItem value="1y">Último año</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Departamentos</SelectItem>
                    <SelectItem value="campo-norte">Campo - Zona Norte</SelectItem>
                    <SelectItem value="campo-sur">Campo - Zona Sur</SelectItem>
                    <SelectItem value="campo-centro">Campo - Zona Centro</SelectItem>
                    <SelectItem value="oficina">Oficina Central</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="supervision">Supervisión</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" size="sm">
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas principales */}
        <StatsCards dateRange={dateRange} department={selectedDepartment} />

        {/* Tabs principales */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen General</TabsTrigger>
            <TabsTrigger value="attendance">Asistencia Detallada</TabsTrigger>
            <TabsTrigger value="compliance">Cumplimiento Legal</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfica de asistencia por día */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Tendencia de Asistencia
                  </CardTitle>
                  <CardDescription>
                    Asistencia diaria en los últimos{" "}
                    {dateRange === "7d" ? "7 días" : dateRange === "30d" ? "30 días" : "días seleccionados"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AttendanceChart dateRange={dateRange} />
                </CardContent>
              </Card>

              {/* Gráfica por departamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Asistencia por Departamento
                  </CardTitle>
                  <CardDescription>Distribución de asistencia por área de trabajo</CardDescription>
                </CardHeader>
                <CardContent>
                  <DepartmentChart dateRange={dateRange} />
                </CardContent>
              </Card>
            </div>

            {/* Tabla de registros recientes personalizada */}
            <RegistrosRecientesCard />
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registro Completo de Asistencia</CardTitle>
                <CardDescription>Historial detallado de todos los registros de asistencia</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Cumplimiento de Horarios
                  </CardTitle>
                  <CardDescription>Análisis de cumplimiento según normativas laborales</CardDescription>
                </CardHeader>
                <CardContent>
                  <ComplianceChart type="schedule" dateRange={dateRange} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horas Trabajadas vs. Requeridas</CardTitle>
                  <CardDescription>Comparación con las 8 horas laborales requeridas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ComplianceChart type="hours" dateRange={dateRange} />
                </CardContent>
              </Card>
            </div>

            {/* Alertas de cumplimiento */}
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Cumplimiento</CardTitle>
                <CardDescription>Situaciones que requieren atención según la Secretaría del Trabajo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-800">3 empleados con horas extras excesivas</p>
                      <p className="text-sm text-yellow-600">Más de 9 horas diarias en la última semana</p>
                    </div>
                    <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                      Atención
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <p className="font-medium text-red-800">2 empleados sin registro de salida</p>
                      <p className="text-sm text-red-600">Registros incompletos del día anterior</p>
                    </div>
                    <Badge variant="outline" className="text-red-700 border-red-300">
                      Urgente
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">95% de cumplimiento general</p>
                      <p className="text-sm text-green-600">Dentro de los parámetros legales</p>
                    </div>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      Óptimo
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="mb-6">
              <Link href="/reports">
                <Card className="cursor-pointer hover:shadow-md transition-shadow bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Shield className="w-6 h-6" />
                      Reportes de Cumplimiento Legal
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Accede al sistema completo de reportes para la Secretaría del Trabajo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Ir a Reportes Legales
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Reporte Mensual</CardTitle>
                  <CardDescription>Resumen completo del mes actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generar PDF
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Reporte Legal</CardTitle>
                  <CardDescription>Para presentar a la Secretaría del Trabajo</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generar PDF
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Reporte por Empleado</CardTitle>
                  <CardDescription>Historial individual detallado</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generar PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
