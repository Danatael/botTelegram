import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Clock, DollarSign } from "lucide-react"

interface OvertimeReportProps {
  period: string
}

export function OvertimeReport({ period }: OvertimeReportProps) {
  const overtimeData = [
    {
      employee: "EMP001",
      name: "Juan Pérez",
      department: "Campo Norte",
      regularHours: 160,
      overtimeHours: 12,
      doublePayHours: 9,
      triplePayHours: 3,
      violations: 1,
      totalPay: 15840,
      overtimePay: 2160,
    },
    {
      employee: "EMP004",
      name: "Ana Martínez",
      department: "Mantenimiento",
      regularHours: 152,
      overtimeHours: 18,
      doublePayHours: 9,
      triplePayHours: 9,
      violations: 2,
      totalPay: 16320,
      overtimePay: 3240,
    },
  ]

  const getViolationBadge = (violations: number) => {
    if (violations === 0) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Cumple</Badge>
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
          <CardTitle className="text-2xl">Análisis de Horas Extras - Art. 67 LFT</CardTitle>
          <CardDescription className="text-lg mt-2">
            Control de cumplimiento de límites de horas extraordinarias
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Resumen de horas extras */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Horas Extraordinarias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">30</div>
              <div className="text-sm text-blue-600">Total Horas Extras</div>
            </div>

            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">$5,400</div>
              <div className="text-sm text-green-600">Pago Horas Extras</div>
            </div>

            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">3</div>
              <div className="text-sm text-yellow-600">Violaciones Detectadas</div>
            </div>

            <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700">12</div>
              <div className="text-sm text-red-600">Horas Pago Triple</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalle por empleado */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Horas Extras por Empleado</CardTitle>
          <CardDescription>Análisis individual de cumplimiento normativo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Horas Regulares</TableHead>
                <TableHead>Horas Extras</TableHead>
                <TableHead>Pago Doble</TableHead>
                <TableHead>Pago Triple</TableHead>
                <TableHead>Cumplimiento</TableHead>
                <TableHead>Total Pago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overtimeData.map((employee, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.employee}</div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.regularHours}h</TableCell>
                  <TableCell>
                    <div className="font-medium">{employee.overtimeHours}h</div>
                    {employee.overtimeHours > 9 && <div className="text-xs text-red-600">Excede límite semanal</div>}
                  </TableCell>
                  <TableCell>{employee.doublePayHours}h</TableCell>
                  <TableCell>
                    <div className={employee.triplePayHours > 0 ? "text-red-600 font-medium" : ""}>
                      {employee.triplePayHours}h
                    </div>
                  </TableCell>
                  <TableCell>{getViolationBadge(employee.violations)}</TableCell>
                  <TableCell>
                    <div className="font-medium">${employee.totalPay.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Extras: ${employee.overtimePay.toLocaleString()}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Marco legal */}
      <Card className="bg-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-800">Marco Legal - Artículo 67 LFT</CardTitle>
        </CardHeader>
        <CardContent className="text-orange-700 text-sm space-y-2">
          <p>
            <strong>Límites de Horas Extraordinarias:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Máximo 3 horas diarias de trabajo extraordinario</li>
            <li>Máximo 3 veces por semana</li>
            <li>Máximo 9 horas extraordinarias por semana</li>
            <li>Las primeras 9 horas se pagan al 100% adicional (pago doble)</li>
            <li>Las horas que excedan 9 semanales se pagan al 200% adicional (pago triple)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
