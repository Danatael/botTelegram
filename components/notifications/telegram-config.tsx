import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MessageSquare, Users, Settings, CheckCircle, XCircle, RefreshCw } from "lucide-react"

export function TelegramConfig() {
  const telegramUsers = [
    {
      id: "TG001",
      name: "Juan Pérez",
      username: "@juan_perez",
      chatId: "123456789",
      role: "Empleado",
      department: "Campo Norte",
      status: "active",
      lastSeen: "2024-01-15 14:30",
    },
    {
      id: "TG002",
      name: "María González",
      username: "@maria_gonzalez",
      chatId: "987654321",
      role: "Supervisor",
      department: "Oficina",
      status: "active",
      lastSeen: "2024-01-15 15:45",
    },
    {
      id: "TG003",
      name: "Carlos Rodríguez",
      username: "@carlos_rodriguez",
      chatId: "456789123",
      role: "Empleado",
      department: "Campo Sur",
      status: "inactive",
      lastSeen: "2024-01-12 09:15",
    },
  ]

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="w-3 h-3 mr-1" />
        Activo
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <XCircle className="w-3 h-3 mr-1" />
        Inactivo
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    return role === "Supervisor" ? (
      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Supervisor</Badge>
    ) : (
      <Badge variant="outline">Empleado</Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Configuración del bot */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Configuración del Bot de Telegram
          </CardTitle>
          <CardDescription>Configuración principal del bot de Telegram para notificaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bot-token">Token del Bot</Label>
              <Input
                id="bot-token"
                type="password"
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                defaultValue="••••••••••••••••••••••••••••••••••••••••"
              />
            </div>

            <div>
              <Label htmlFor="bot-username">Nombre del Bot</Label>
              <Input id="bot-username" placeholder="@witmac_asistencia_bot" defaultValue="@witmac_asistencia_bot" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://api.witmac.com/telegram/webhook"
                defaultValue="https://api.witmac.com/telegram/webhook"
              />
            </div>

            <div>
              <Label htmlFor="admin-chat">Chat ID Administrador</Label>
              <Input id="admin-chat" placeholder="123456789" defaultValue="123456789" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Guardar Configuración
            </Button>

            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Probar Conexión
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estado de conexión */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-green-700">Conectado</div>
            <div className="text-sm text-green-600">Bot Funcionando</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-blue-700">45</div>
            <div className="text-sm text-blue-600">Usuarios Registrados</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-lg font-bold text-purple-700">127</div>
            <div className="text-sm text-purple-600">Mensajes Enviados Hoy</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios de Telegram Registrados</CardTitle>
          <CardDescription>Lista de empleados que han configurado el bot de Telegram</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Chat ID</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Actividad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {telegramUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.id}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{user.username}</TableCell>
                  <TableCell className="font-mono text-sm">{user.chatId}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-sm text-gray-500">{user.lastSeen}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-3 h-3" />
                      </Button>
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

      {/* Instrucciones de configuración */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Instrucciones para Empleados</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 text-sm space-y-2">
          <p>
            <strong>Para configurar el bot de Telegram:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>
              Buscar el bot <code className="bg-blue-100 px-1 rounded">@witmac_asistencia_bot</code> en Telegram
            </li>
            <li>
              Enviar el comando <code className="bg-blue-100 px-1 rounded">/start</code>
            </li>
            <li>Proporcionar su código de empleado cuando se solicite</li>
            <li>Confirmar su registro con el código de verificación</li>
            <li>El bot estará listo para recibir notificaciones y registrar asistencia</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
