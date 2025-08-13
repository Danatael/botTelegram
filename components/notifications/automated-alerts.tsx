import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Clock, Users, CheckCircle, Settings } from "lucide-react"

export function AutomatedAlerts() {
  const automatedRules = [
    {
      id: "overtime-limit",
      name: "Límite de Horas Extras",
      description: "Alerta cuando un empleado excede 9 horas extras semanales",
      condition: "Horas extras > 9 por semana",
      action: "Notificar supervisor + empleado",
      status: "active",
      triggered: 3,
      lastTriggered: "2024-01-15 14:30",
    },
    {
      id: "missing-checkout",
      name: "Salida No Registrada",
      description: "Detectar empleados que no registraron salida después de 19:00",
      condition: "Sin registro salida después 19:00",
      action: "Notificar empleado + supervisor",
      status: "active",
      triggered: 5,
      lastTriggered: "2024-01-15 19:15",
    },
    {
      id: "late-arrival",
      name: "Llegadas Tardías Recurrentes",
      description: "Empleado llega tarde más de 3 veces en una semana",
      condition: "Llegadas tarde > 3 por semana",
      action: "Notificar supervisor",
      status: "active",
      triggered: 1,
      lastTriggered: "2024-01-12 08:45",
    },
    {
      id: "consecutive-absences",
      name: "Ausencias Consecutivas",
      description: "Empleado ausente por más de 2 días consecutivos",
      condition: "Ausencias consecutivas > 2 días",
      action: "Notificar RH + supervisor",
      status: "inactive",
      triggered: 0,
      lastTriggered: "Nunca",
    },
    {
      id: "weekend-work",
      name: "Trabajo en Fin de Semana",
      description: "Detectar trabajo en días de descanso obligatorio",
      condition: "Registro en domingo sin autorización",
      action: "Notificar RH (cumplimiento legal)",
      status: "active",
      triggered: 2,
      lastTriggered: "2024-01-14 10:00",
    },
  ]

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activa</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactiva</Badge>
    )
  }

  const getPriorityColor = (triggered: number) => {
    if (triggered >= 5) return "text-red-600"
    if (triggered >= 3) return "text-orange-600"
    if (triggered >= 1) return "text-yellow-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      {/* Resumen de alertas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">11</div>
            <div className="text-sm text-red-600">Alertas Activadas Hoy</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">5</div>
            <div className="text-sm text-green-600">Reglas Activas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">2.3</div>
            <div className="text-sm text-blue-600">Min Tiempo Respuesta</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">8</div>
            <div className="text-sm text-purple-600">Empleados Afectados</div>
          </CardContent>
        </Card>
      </div>

      {/* Configuración de reglas automáticas */}
      <Card>
        <CardHeader>
          <CardTitle>Reglas de Alertas Automáticas</CardTitle>
          <CardDescription>
            Configuración de alertas que se activan automáticamente según condiciones predefinidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Regla</TableHead>
                <TableHead>Condición</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Activaciones</TableHead>
                <TableHead>Última Activación</TableHead>
                <TableHead>Configurar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automatedRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-gray-500">{rule.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{rule.condition}</code>
                  </TableCell>
                  <TableCell className="text-sm">{rule.action}</TableCell>
                  <TableCell>{getStatusBadge(rule.status)}</TableCell>
                  <TableCell>
                    <div className={`font-medium ${getPriorityColor(rule.triggered)}`}>{rule.triggered}</div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{rule.lastTriggered}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={rule.status === "active"} />
                      <Button variant="outline" size="sm">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alertas recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Recientes</CardTitle>
          <CardDescription>Últimas alertas automáticas activadas por el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Horas extras excesivas - Ana Martínez</p>
                  <p className="text-sm text-red-600">12 horas extras esta semana (límite: 9h)</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Urgente</Badge>
                <p className="text-xs text-red-500 mt-1">Hace 15 min</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Salida no registrada - Carlos Rodríguez</p>
                  <p className="text-sm text-yellow-600">No registró salida ayer 14/01/2024</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Atención</Badge>
                <p className="text-xs text-yellow-500 mt-1">Hace 2 horas</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">Trabajo dominical - Luis Hernández</p>
                  <p className="text-sm text-orange-600">Registro en día de descanso obligatorio</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Legal</Badge>
                <p className="text-xs text-orange-500 mt-1">Hace 1 día</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
