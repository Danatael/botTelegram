import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, MessageSquare, AlertTriangle, Clock, Users, CheckCircle } from "lucide-react"

export function NotificationHistory() {
  const notifications = [
    {
      id: "NOT001",
      type: "attendance-reminder",
      title: "Recordatorio de Entrada",
      message: "Recuerda registrar tu entrada. Horario: 08:00 AM",
      recipients: ["Juan Pérez", "María González", "Carlos Rodríguez"],
      sentAt: "2024-01-15 08:00:00",
      status: "delivered",
      priority: "normal",
      channel: "telegram",
    },
    {
      id: "NOT002",
      type: "compliance-alert",
      title: "Alerta: Horas Extras Excesivas",
      message: "Ana Martínez ha excedido el límite de horas extras (12h esta semana)",
      recipients: ["Supervisor RH", "Ana Martínez"],
      sentAt: "2024-01-15 14:30:00",
      status: "delivered",
      priority: "high",
      channel: "telegram",
    },
    {
      id: "NOT003",
      type: "missing-checkout",
      title: "Salida No Registrada",
      message: "No registraste tu salida ayer. Por favor contacta a tu supervisor.",
      recipients: ["Carlos Rodríguez"],
      sentAt: "2024-01-15 19:00:00",
      status: "failed",
      priority: "normal",
      channel: "telegram",
    },
    {
      id: "NOT004",
      type: "daily-report",
      title: "Reporte Diario de Asistencia",
      message: "Resumen: 42/45 empleados presentes. 3 llegadas tarde.",
      recipients: ["Supervisor General"],
      sentAt: "2024-01-15 18:00:00",
      status: "delivered",
      priority: "low",
      channel: "telegram",
    },
    {
      id: "NOT005",
      type: "overtime-warning",
      title: "Advertencia: Límite de Horas Extras",
      message: "Estás cerca del límite semanal de horas extras (8/9 horas)",
      recipients: ["Luis Hernández"],
      sentAt: "2024-01-15 16:45:00",
      status: "delivered",
      priority: "medium",
      channel: "telegram",
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "attendance-reminder":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "compliance-alert":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "missing-checkout":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "daily-report":
        return <Users className="w-4 h-4 text-green-500" />
      case "overtime-warning":
        return <Clock className="w-4 h-4 text-orange-500" />
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Entregado</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Falló</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Alta</Badge>
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Media</Badge>
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Normal</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Baja</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas del historial */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">127</div>
            <div className="text-sm text-blue-600">Total Enviadas Hoy</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">98.4%</div>
            <div className="text-sm text-green-600">Tasa de Entrega</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">2</div>
            <div className="text-sm text-red-600">Fallos de Envío</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">1.2s</div>
            <div className="text-sm text-purple-600">Tiempo Promedio</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input placeholder="Buscar notificaciones..." className="w-64" />
            </div>

            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="attendance-reminder">Recordatorios</SelectItem>
                <SelectItem value="compliance-alert">Alertas Cumplimiento</SelectItem>
                <SelectItem value="missing-checkout">Salidas Perdidas</SelectItem>
                <SelectItem value="daily-report">Reportes Diarios</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="delivered">Entregado</SelectItem>
                <SelectItem value="failed">Falló</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historial de notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Notificaciones</CardTitle>
          <CardDescription>Registro completo de todas las notificaciones enviadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Destinatarios</TableHead>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Canal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(notification.type)}
                      <span className="text-sm">{notification.type.replace("-", " ")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{notification.message}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {notification.recipients.length === 1 ? (
                        notification.recipients[0]
                      ) : (
                        <span>{notification.recipients.length} destinatarios</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{new Date(notification.sentAt).toLocaleString("es-MX")}</TableCell>
                  <TableCell>{getStatusBadge(notification.status)}</TableCell>
                  <TableCell>{getPriorityBadge(notification.priority)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <MessageSquare className="w-3 h-3" />
                      Telegram
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
