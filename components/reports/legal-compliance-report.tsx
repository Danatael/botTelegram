import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, AlertTriangle, XCircle, Download, FileText } from "lucide-react"

interface LegalComplianceReportProps {
  period: string
}

export function LegalComplianceReport({ period }: LegalComplianceReportProps) {
  const complianceData = {
    summary: {
      totalEmployees: 45,
      compliantEmployees: 43,
      nonCompliantEmployees: 2,
      complianceRate: 95.6,
      totalViolations: 5,
      resolvedViolations: 3,
      pendingViolations: 2,
    },
    violations: [
      {
        employee: "EMP004",
        name: "Ana Martínez",
        violation: "Exceso de horas extras",
        article: "Art. 67 LFT",
        severity: "Alta",
        date: "2024-01-15",
        status: "Pendiente",
        description: "Trabajó 12 horas en un día (máximo permitido: 11 horas)",
      },
      {
        employee: "EMP012",
        name: "Roberto Silva",
        violation: "Falta de descanso semanal",
        article: "Art. 69 LFT",
        severity: "Media",
        date: "2024-01-10",
        status: "Resuelto",
        description: "No tuvo día de descanso en la semana del 8-14 enero",
      },
    ],
    departmentCompliance: [
      { department: "Campo Norte", employees: 12, compliant: 12, rate: 100 },
      { department: "Campo Sur", employees: 10, compliant: 9, rate: 90 },
      { department: "Campo Centro", employees: 8, compliant: 8, rate: 100 },
      { department: "Oficina", employees: 6, compliant: 6, rate: 100 },
      { department: "Mantenimiento", employees: 5, compliant: 4, rate: 80 },
      { department: "Supervisión", employees: 4, compliant: 4, rate: 100 },
    ],
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Alta":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Alta</Badge>
      case "Media":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Media</Badge>
      case "Baja":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Baja</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Resuelto":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resuelto</Badge>
      case "Pendiente":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Pendiente</Badge>
      case "En Proceso":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En Proceso</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header del reporte */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Reporte de Cumplimiento STPS</CardTitle>
              <CardDescription className="text-lg mt-2">
                Período: {period === "current-month" ? "Mes Actual" : period} | Generado:{" "}
                {new Date().toLocaleDateString("es-MX")}
              </CardDescription>
            </div>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF Oficial
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Resumen ejecutivo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Ejecutivo de Cumplimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">{complianceData.summary.complianceRate}%</div>
              <div className="text-sm text-green-600">Cumplimiento General</div>
            </div>

            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{complianceData.summary.compliantEmployees}</div>
              <div className="text-sm text-blue-600">Empleados Cumpliendo</div>
            </div>

            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">{complianceData.summary.pendingViolations}</div>
              <div className="text-sm text-yellow-600">Incidencias Pendientes</div>
            </div>

            <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700">{complianceData.summary.nonCompliantEmployees}</div>
              <div className="text-sm text-red-600">Empleados No Cumpliendo</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cumplimiento por departamento */}
      <Card>
        <CardHeader>
          <CardTitle>Cumplimiento por Departamento</CardTitle>
          <CardDescription>Análisis de cumplimiento normativo por área de trabajo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Departamento</TableHead>
                <TableHead>Total Empleados</TableHead>
                <TableHead>Cumpliendo</TableHead>
                <TableHead>Tasa de Cumplimiento</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complianceData.departmentCompliance.map((dept, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{dept.department}</TableCell>
                  <TableCell>{dept.employees}</TableCell>
                  <TableCell>{dept.compliant}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${dept.rate >= 95 ? "bg-green-500" : dept.rate >= 80 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${dept.rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{dept.rate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {dept.rate >= 95 ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Óptimo</Badge>
                    ) : dept.rate >= 80 ? (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Aceptable</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Requiere Atención</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Incidencias y violaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Incidencias Normativas</CardTitle>
          <CardDescription>Detalle de violaciones a la Ley Federal del Trabajo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Violación</TableHead>
                <TableHead>Artículo LFT</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complianceData.violations.map((violation, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{violation.name}</div>
                      <div className="text-sm text-gray-500">{violation.employee}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{violation.violation}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{violation.article}</Badge>
                  </TableCell>
                  <TableCell>{getSeverityBadge(violation.severity)}</TableCell>
                  <TableCell>{new Date(violation.date).toLocaleDateString("es-MX")}</TableCell>
                  <TableCell>{getStatusBadge(violation.status)}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-gray-600 truncate" title={violation.description}>
                      {violation.description}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Certificación legal */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <FileText className="w-5 h-5" />
            Certificación de Cumplimiento Legal
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="space-y-4">
            <p className="text-sm">
              <strong>CERTIFICO:</strong> Que el presente reporte ha sido generado conforme a los lineamientos
              establecidos en la Ley Federal del Trabajo y las Normas Oficiales Mexicanas aplicables en materia de
              seguridad y salud en el trabajo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>Empresa:</strong> Witmac S.A. de C.V.
                </p>
                <p>
                  <strong>RFC:</strong> WIT123456789
                </p>
                <p>
                  <strong>Registro Patronal IMSS:</strong> 12345678901
                </p>
              </div>
              <div>
                <p>
                  <strong>Período Reportado:</strong> {period}
                </p>
                <p>
                  <strong>Fecha de Generación:</strong> {new Date().toLocaleDateString("es-MX")}
                </p>
                <p>
                  <strong>Sistema:</strong> Witmac Attendance Control v1.0
                </p>
              </div>
            </div>

            <div className="border-t border-blue-300 pt-4 mt-4">
              <p className="text-xs text-blue-600">
                Este reporte es válido para presentar ante la Secretaría del Trabajo y Previsión Social y cumple con los
                requisitos establecidos en el Reglamento Federal de Seguridad y Salud en el Trabajo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
