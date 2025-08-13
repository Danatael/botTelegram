"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Send,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  MessageSquare,
  Settings,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { NotificationHistory } from "@/components/notifications/notification-history"
import { AutomatedAlerts } from "@/components/notifications/automated-alerts"
import { TelegramConfig } from "@/components/notifications/telegram-config"

export default function NotificationsPage() {
  const [isTestSending, setIsTestSending] = useState(false)
  const [testMessage, setTestMessage] = useState("")

  const handleTestNotification = async () => {
    setIsTestSending(true)

    // Simular envío de notificación de prueba
    setTimeout(() => {
      setIsTestSending(false)
      alert("Notificación de prueba enviada exitosamente por Telegram")
    }, 2000)
  }

  const notificationTypes = [
    {
      id: "attendance-reminder",
      title: "Recordatorio de Asistencia",
      description: "Recordar a empleados registrar entrada/salida",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      enabled: true,
      schedule: "08:00, 17:00",
    },
    {
      id: "compliance-alert",
      title: "Alertas de Cumplimiento",
      description: "Notificar violaciones a normativas laborales",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      enabled: true,
      schedule: "Inmediato",
    },
    {
      id: "overtime-warning",
      title: "Advertencia Horas Extras",
      description: "Alertar cuando se exceden límites de horas extras",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      enabled: true,
      schedule: "Al detectar",
    },
    {
      id: "daily-report",
      title: "Reporte Diario",
      description: "Resumen diario de asistencia a supervisores",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      enabled: false,
      schedule: "18:00",
    },
    {
      id: "missing-checkout",
      title: "Salida No Registrada",
      description: "Notificar empleados que no registraron salida",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      enabled: true,
      schedule: "19:00",
    },
  ]

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
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Notificaciones</h1>
              <p className="text-gray-600 mt-1">Configuración de alertas y notificaciones por Telegram</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              <MessageSquare className="w-3 h-3 mr-1" />
              Telegram Conectado
            </Badge>
            <Button onClick={handleTestNotification} disabled={isTestSending}>
              {isTestSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Prueba
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Estado del sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Estado del Sistema de Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">Activo</div>
                <div className="text-sm text-green-600">Sistema Funcionando</div>
              </div>

              <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">45</div>
                <div className="text-sm text-blue-600">Usuarios Telegram</div>
              </div>

              <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <Send className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700">127</div>
                <div className="text-sm text-purple-600">Notificaciones Hoy</div>
              </div>

              <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-700">3</div>
                <div className="text-sm text-orange-600">Alertas Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs principales */}
        <Tabs defaultValue="types" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="types">Tipos de Notificación</TabsTrigger>
            <TabsTrigger value="automated">Alertas Automáticas</TabsTrigger>
            <TabsTrigger value="config">Configuración Telegram</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="types" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {notificationTypes.map((type) => (
                <Card key={type.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className={type.bgColor}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <type.icon className={`w-5 h-5 ${type.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{type.title}</CardTitle>
                          <CardDescription className="text-sm">{type.description}</CardDescription>
                        </div>
                      </div>
                      <Switch checked={type.enabled} />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-600">Horario:</Label>
                        <p className="font-medium">{type.schedule}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Estado:</Label>
                        <Badge
                          className={
                            type.enabled
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {type.enabled ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`schedule-${type.id}`}>Configurar Horario:</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`schedule-${type.id}`}
                          placeholder="08:00, 17:00"
                          defaultValue={type.schedule}
                          className="flex-1"
                        />
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      Configurar Destinatarios
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="automated" className="space-y-6">
            <AutomatedAlerts />
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <TelegramConfig />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <NotificationHistory />
          </TabsContent>
        </Tabs>

        {/* Envío de notificación manual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Enviar Notificación Manual
            </CardTitle>
            <CardDescription>Envía una notificación personalizada a empleados o supervisores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipients">Destinatarios</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar destinatarios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Empleados</SelectItem>
                    <SelectItem value="supervisors">Solo Supervisores</SelectItem>
                    <SelectItem value="campo-norte">Campo - Zona Norte</SelectItem>
                    <SelectItem value="campo-sur">Campo - Zona Sur</SelectItem>
                    <SelectItem value="campo-centro">Campo - Zona Centro</SelectItem>
                    <SelectItem value="oficina">Oficina Central</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="message">Mensaje</Label>
              <Textarea
                id="message"
                placeholder="Escribe tu mensaje aquí..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleTestNotification} disabled={isTestSending || !testMessage.trim()}>
                {isTestSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Ahora
                  </>
                )}
              </Button>

              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Programar Envío
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
