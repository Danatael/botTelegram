"use client"

import { useState, useEffect } from "react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { useMediaQuery } from "@/hooks/use-mobile"

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("7d")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [modalEmpleadoOpen, setModalEmpleadoOpen] = useState(false)
  const [empleados, setEmpleados] = useState([])
  const [empleadoId, setEmpleadoId] = useState("")
  const [periodo, setPeriodo] = useState("mes")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (modalEmpleadoOpen && empleados.length === 0) {
      fetch("/api/empleados").then(r => r.json()).then(data => setEmpleados(data))
    }
  }, [modalEmpleadoOpen])

  const handleGenerarPDF = () => {
    if (!empleadoId) return
    window.open(`/api/reports/empleado?empleadoId=${empleadoId}&periodo=${periodo}`, "_blank")
    setModalEmpleadoOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-700 text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard de Asistencia - Witmac</h1>
            <p className="text-gray-400 mt-1">Panel de control y análisis histórico</p>
          </div>
          <div className="bg-black text-white flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="bg-black text-white flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Sistema Activo
            </Badge>
            <Link href="/notifications" className="bg-black text-white">
              <Button variant="outline" size="sm" className="bg-black text-white border-white hover:bg-gray-900 hover:text-white transition-colors">
                <Bell className="w-4 h-4 mr-2 text-white" />
                <span className="group-hover:text-white">Notificaciones</span>
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="outline" size="sm" className="bg-black text-white border-white hover:bg-gray-900 hover:text-white transition-colors">
                <Shield className="w-4 h-4 mr-2 text-white" />
                <span className="group-hover:text-white">Reportes Legales</span>
              </Button>
            </Link>
            {/* <Button variant="outline" size="sm" className="bg-black text-white border-white hover:bg-gray-900 hover:text-white transition-colors">
              <Download className="w-4 h-4 mr-2 text-white" />
              <span className="group-hover:text-white">Exportar</span>
            </Button> */}
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Estadísticas principales */}
        <StatsCards dateRange={dateRange} department={selectedDepartment} />

        {/* Tabs principales */}
        <div className="space-y-6">
          {/* Mobile: select */}
          <div className="block sm:hidden mb-2">
            <select
              className="w-full p-2 rounded text-white bg-blue-700 focus:ring-2 focus:ring-blue-400"
              value={activeTab}
              onChange={e => setActiveTab(e.target.value)}
            >
              <option value="overview">Resumen General</option>
              <option value="attendance">Asistencia Detallada</option>
              <option value="compliance">Cumplimiento Legal</option>
              <option value="reports">Reportes</option>
            </select>
          </div>
          {/* Tabs principales */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="hidden lg:grid w-full grid-cols-4 bg-black text-white border-b border-gray-700 rounded-t-lg">
              <TabsTrigger value="overview" className={activeTab === 'overview' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-800'}>Resumen General</TabsTrigger>
              <TabsTrigger value="attendance" className={activeTab === 'attendance' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-800'}>Asistencia Detallada</TabsTrigger>
              <TabsTrigger value="compliance" className={activeTab === 'compliance' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-800'}>Cumplimiento Legal</TabsTrigger>
              <TabsTrigger value="reports" className={activeTab === 'reports' ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-800'}>Reportes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfica de asistencia por día */}
                <Card className="bg-black text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <TrendingUp className="w-5 h-5" />
                      Tendencia de Asistencia
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Asistencia diaria en los últimos{" "}
                      {dateRange === "7d" ? "7 días" : dateRange === "30d" ? "30 días" : "días seleccionados"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AttendanceChart dateRange={dateRange} />
                  </CardContent>
                </Card>

                {/* Gráfica por departamento */}
                <Card className="bg-black text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Users className="w-5 h-5" />
                      Asistencia por Departamento
                    </CardTitle>
                    <CardDescription className="text-gray-300">Distribución de asistencias</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DepartmentChart
                      dateRange={dateRange}
                      roles={[
                        "Administración - Recargalos",
                        "Administrativo - Recargalos",
                        "Técnico Instalador",
                        "Marketing",
                        "Soporte Técnico Administrativo",
                        "Soporte Técnico"
                      ]}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Tabla de registros recientes personalizada */}
              <RegistrosRecientesCard />
            </TabsContent>

            <TabsContent value="attendance" className="space-y-6">
              <Card className="bg-black text-white">
                <CardHeader>
                  <CardTitle className="text-white">Registro Completo de Asistencia</CardTitle>
                  <CardDescription className="text-gray-300">Historial detallado de todos los registros de asistencia</CardDescription>
                </CardHeader>
                <CardContent>
                  <AttendanceTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black text-white">
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

                <Card className="bg-black text-white">
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
              <Card className="bg-black text-white">
                <CardHeader>
                  <CardTitle>Alertas de Cumplimiento</CardTitle>
                  <CardDescription>Situaciones que requieren atención según la Secretaría del Trabajo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-black border border-yellow-200 rounded-lg">
                      <div>
                        <p className="font-medium text-yellow-800">3 empleados con horas extras excesivas</p>
                        <p className="text-sm text-yellow-600">Más de 9 horas diarias en la última semana</p>
                      </div>
                      <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                        Atención
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black border border-red-200 rounded-lg">
                      <div>
                        <p className="font-medium text-red-800">2 empleados sin registro de salida</p>
                        <p className="text-sm text-red-600">Registros incompletos del día anterior</p>
                      </div>
                      <Badge variant="outline" className="text-red-700 border-red-300">
                        Urgente
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-black border border-green-200 rounded-lg">
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
                  <Card className="cursor-pointer hover:shadow-md transition-shadow bg-black border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-400">
                        <Shield className="w-6 h-6" />
                        Reportes de Cumplimiento Legal
                      </CardTitle>
                      <CardDescription className="text-blue-300">
                        Accede al sistema completo de reportes para la Secretaría del Trabajo
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <FileText className="w-4 h-4 mr-2" />
                        Ir a Reportes Legales
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow bg-black">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Reporte Mensual</CardTitle>
                      <CardDescription className="text-gray-300">Resumen completo del mes actual</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.open('/api/reports/mensual', '_blank')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Generar PDF Mensual
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow bg-black">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Reporte Legal</CardTitle>
                      <CardDescription className="text-gray-300">Para presentar a la Secretaría del Trabajo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Generar PDF
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex flex-col gap-4">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow bg-black">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Reporte por Empleado</CardTitle>
                      <CardDescription className="text-gray-300">Historial individual detallado</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setModalEmpleadoOpen(true)}>
                        <Download className="w-4 h-4 mr-2" />
                        Generar PDF
                      </Button>
                      <Dialog open={modalEmpleadoOpen} onOpenChange={setModalEmpleadoOpen}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reporte por Empleado</DialogTitle>
                            <DialogDescription>Selecciona un empleado y el periodo para generar el PDF</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="block mb-1">Empleado</label>
                              <select className="w-full p-2 rounded text-black" value={empleadoId} onChange={e => setEmpleadoId(e.target.value)}>
                                <option value="">Selecciona un empleado</option>
                                {empleados.map((emp: any) => (
                                  <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block mb-1">Periodo</label>
                              <select className="w-full p-2 rounded text-black" value={periodo} onChange={e => setPeriodo(e.target.value)}>
                                <option value="dia">Día</option>
                                <option value="semana">Semana</option>
                                <option value="mes">Mes</option>
                                <option value="año">Año</option>
                              </select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleGenerarPDF} disabled={!empleadoId}>
                              <Download className="w-4 h-4 mr-2" />
                              Generar PDF
                            </Button>
                            <DialogClose asChild>
                              <Button variant="outline">Cancelar</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow bg-black">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Reporte Diario</CardTitle>
                      <CardDescription className="text-gray-300">Resumen de asistencia del día actual</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.open('/api/reports/diario', '_blank')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Generar PDF Diario
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
