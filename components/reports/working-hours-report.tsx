import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, Sun, Moon, Sunset } from "lucide-react"

interface WorkingHoursReportProps {
  period: string
}

export function WorkingHoursReport({ period }: WorkingHoursReportProps) {
  const workingHoursData = [
    {
      employee: "EMP001",
      name: "Juan Pérez",
      shiftType: "Diurna",
      maxAllowed: 8,
      avgDaily: 8.2,
      violations: 2,
      totalDays: 22,
      compliantDays: 20,
    },
    {
      employee: "EMP015",
      name: "Carlos Noche",
      shiftType: "Nocturna",
      maxAllowed: 7,
      avgDaily: 7.1,
      violations: 1,
      totalDays: 22,
      compliantDays: 21,
    },
    {
      employee: "EMP008",
      name: "María Mixta",
      shiftType: "Mixta",
      maxAllowed: 7.5,
      avgDaily: 7.3,
      violations: 0,
      totalDays: 22,
      compliantDays: 22,
    },
  ]

  const getShiftIcon = (shiftType: string) => {
    switch (shiftType) {
      case "Diurna":
        return <Sun className="w-4 h-4 text-yellow-500" />
      case "Nocturna":
        return <Moon className="w-4 h-4 text-blue-500" />
      case "Mixta":
        return <Sunset className="w-4 h-4 text-orange-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getComplianceBadge = (violations: number) => {
    if (violations === 0) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">100% Cumple</Badge>
    } else if (violations <= 2) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{violations} Violación(es)</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{violations} Violaciones</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Control de Jornada Laboral - Art. 61 LFT</CardTitle>
          <CardDescription className="text-lg mt-2">
            Verificación de cumplimiento de duración máxima de jornada
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Resumen por tipo de jornada */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Tipo de Jornada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Sun className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">32</div>
              <div className="text-sm text-yellow-600">Jornada Diurna (8h máx)</div>
              <div className="text-xs text-yellow-500 mt-1">6:00 AM - 8:00 PM</div>
            </div>

            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Moon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">8</div>
              <div className="text-sm text-blue-600">Jornada Nocturna (7h máx)</div>
              <div className="text-xs text-blue-500 mt-1">8:00 PM - 6:00 AM</div>
            </div>

            <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <Sunset className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700">5</div>
              <div className="text-sm text-orange-600">Jornada Mixta (7.5h máx)</div>
              <div className="text-xs text-orange-500 mt-1">Diurna + Nocturna</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalle por empleado */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis Individual de Jornada</CardTitle>
          <CardDescription>Control de cumplimiento por empleado</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Tipo de Jornada</TableHead>
                <TableHead>Máximo Permitido</TableHead>
                <TableHead>Promedio Diario</TableHead>
                <TableHead>Días Trabajados</TableHead>
                <TableHead>Días Cumpliendo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workingHoursData.map((employee, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.employee}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getShiftIcon(employee.shiftType)}
                      <span>{employee.shiftType}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{employee.maxAllowed}h</TableCell>
                  <TableCell>
                    <div
                      className={
                        employee.avgDaily > employee.maxAllowed ? "text-red-600 font-medium" : "text-green-600"
                      }
                    >
                      {employee.avgDaily}h
                    </div>
                  </TableCell>
                  <TableCell>{employee.totalDays}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{employee.compliantDays}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${employee.violations === 0 ? "bg-green-500" : employee.violations <= 2 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${(employee.compliantDays / employee.totalDays) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getComplianceBadge(employee.violations)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Marco legal */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Marco Legal - Artículo 61 LFT</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 text-sm space-y-2">
          <p>
            <strong>Duración Máxima de la Jornada de Trabajo:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Jornada Diurna:</strong> Máximo 8 horas (entre las 6:00 y las 20:00 horas)
            </li>
            <li>
              <strong>Jornada Nocturna:</strong> Máximo 7 horas (entre las 20:00 y las 6:00 horas)
            </li>
            <li>
              <strong>Jornada Mixta:</strong> Máximo 7.5 horas (incluye períodos diurnos y nocturnos)
            </li>
            <li>Los trabajadores tendrán derecho a un descanso de media hora, por lo menos</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
