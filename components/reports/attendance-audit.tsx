import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, MapPin, Smartphone, Clock } from "lucide-react"

interface AttendanceAuditProps {
  period: string
}

export function AttendanceAudit({ period }: AttendanceAuditProps) {
  const auditData = [
    {
      date: "2024-01-15",
      employee: "EMP001",
      name: "Juan Pérez",
      checkIn: "08:00:15",
      checkOut: "17:05:22",
      method: "QR Code",
      location: "Obra Central",
      gpsCoords: "19.4326, -99.1332",
      deviceId: "TG_Bot_001",
      verified: true,
      modifications: 0,
    },
    {
      date: "2024-01-15",
      employee: "EMP004",
      name: "Ana Martínez",
      checkIn: "08:15:33",
      checkOut: "17:00:11",
      method: "Manual",
      location: "Almacén",
      gpsCoords: "19.4285, -99.1277",
      deviceId: "TG_Bot_004",
      verified: true,
      modifications: 1,
    },
  ]

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "QR Code":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">QR Code</Badge>
      case "Manual":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Manual</Badge>
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  const getVerificationBadge = (verified: boolean, modifications: number) => {
    if (verified && modifications === 0) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verificado</Badge>
    } else if (verified && modifications > 0) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Modificado</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Sin Verificar</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Auditoría de Registros de Asistencia</CardTitle>
          <CardDescription className="text-lg mt-2">Trazabilidad completa para inspecciones laborales</CardDescription>
        </CardHeader>
      </Card>

      {/* Resumen de auditoría */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Trazabilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">98%</div>
              <div className="text-sm text-green-600">Registros Verificados</div>
            </div>

            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">100%</div>
              <div className="text-sm text-blue-600">Con Ubicación GPS</div>
            </div>

            <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <Smartphone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">890</div>
              <div className="text-sm text-purple-600">Registros Totales</div>
            </div>

            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-700">12</div>
              <div className="text-sm text-yellow-600">Modificaciones</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalle de registros */}
      <Card>
        <CardHeader>
          <CardTitle>Registro Cronológico Detallado</CardTitle>
          <CardDescription>Historial completo con trazabilidad para auditorías</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Empleado</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Salida</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>GPS</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(record.date).toLocaleDateString("es-MX")}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.name}</div>
                      <div className="text-sm text-gray-500">{record.employee}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{record.checkIn}</TableCell>
                  <TableCell className="font-mono text-sm">{record.checkOut}</TableCell>
                  <TableCell>{getMethodBadge(record.method)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-sm">{record.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-mono text-gray-500">{record.gpsCoords}</div>
                  </TableCell>
                  <TableCell>
                    {getVerificationBadge(record.verified, record.modifications)}
                    {record.modifications > 0 && (
                      <div className="text-xs text-yellow-600 mt-1">{record.modifications} modificación(es)</div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Certificación de integridad */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Certificación de Integridad de Datos</CardTitle>
        </CardHeader>
        <CardContent className="text-green-700 text-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Medidas de Seguridad Implementadas:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Registro con timestamp inmutable</li>
                <li>Verificación de ubicación GPS</li>
                <li>Identificación única de dispositivo</li>
                <li>Hash criptográfico de cada registro</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Cumplimiento Normativo:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Ley Federal de Protección de Datos</li>
                <li>NOM-035-STPS-2018</li>
                <li>Reglamento Federal de Seguridad</li>
                <li>Código de Comercio (firma electrónica)</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-green-300 pt-3 mt-4">
            <p className="text-xs">
              <strong>CERTIFICO:</strong> Que los registros contenidos en este reporte mantienen su integridad original
              y cuentan con las medidas de seguridad necesarias para ser presentados como evidencia ante autoridades
              laborales.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
