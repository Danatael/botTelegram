"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Settings, Bot, Link, AlertCircle } from "lucide-react"

interface WebhookInfo {
  url: string
  has_custom_certificate: boolean
  pending_update_count: number
  last_error_date?: number
  last_error_message?: string
  max_connections?: number
  allowed_updates?: string[]
}

export default function TelegramBotAdmin() {
  const [webhookInfo, setWebhookInfo] = useState<WebhookInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [webhookUrl, setWebhookUrl] = useState('')

  useEffect(() => {
    fetchWebhookInfo()
  }, [])

  const fetchWebhookInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/telegram/setup')
      const data = await response.json()
      
      if (data.success) {
        setWebhookInfo(data.webhookInfo)
        setWebhookUrl(data.webhookInfo.url || '')
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al obtener información del webhook' })
    } finally {
      setLoading(false)
    }
  }

  const setupWebhook = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/telegram/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ webhookUrl }),
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Webhook configurado exitosamente' })
        fetchWebhookInfo()
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al configurar webhook' })
    } finally {
      setLoading(false)
    }
  }

  const getBotLink = () => {
    return "https://t.me/AsistenciasTmac_bot"
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot className="w-8 h-8" />
          Administración del Bot de Telegram
        </h1>
        <p className="text-muted-foreground mt-2">
          Configura y administra el bot de asistencias de Telegram
        </p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Información del Bot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Información del Bot
            </CardTitle>
            <CardDescription>
              Detalles del bot de Telegram configurado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Nombre del Bot</Label>
                <p className="text-lg font-semibold">AsistenciasTmac_bot</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Estado</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Activo
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Enlace del Bot</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input 
                  value={getBotLink()} 
                  readOnly 
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(getBotLink(), '_blank')}
                >
                  <Link className="w-4 h-4 mr-1" />
                  Abrir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración del Webhook */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuración del Webhook
            </CardTitle>
            <CardDescription>
              Configura la URL del webhook para recibir actualizaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL del Webhook</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://tu-dominio.com/api/telegram/webhook"
                  className="flex-1"
                />
                <Button onClick={setupWebhook} disabled={loading}>
                  {loading ? 'Configurando...' : 'Configurar'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Para desarrollo local usa: http://localhost:3000/api/telegram/webhook
              </p>
            </div>

            {webhookInfo && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Estado del Webhook
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">URL Actual:</span>
                    <p className="break-all">{webhookInfo.url || 'No configurada'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Actualizaciones Pendientes:</span>
                    <p>{webhookInfo.pending_update_count}</p>
                  </div>
                  {webhookInfo.last_error_message && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-red-600">Último Error:</span>
                      <p className="text-red-600">{webhookInfo.last_error_message}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comandos del Bot */}
        <Card>
          <CardHeader>
            <CardTitle>Comandos Disponibles</CardTitle>
            <CardDescription>
              Lista de comandos que los usuarios pueden usar en el bot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { command: '/start', description: 'Mensaje de bienvenida e introducción al bot' },
                { command: '/registrar', description: 'Registrar entrada o salida de asistencia' },
                { command: '/estado', description: 'Ver el estado actual de asistencia' },
                { command: '/historial', description: 'Ver historial de asistencias' },
                { command: '/ayuda', description: 'Mostrar ayuda y comandos disponibles' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                    {item.command}
                  </code>
                  <span className="text-sm text-muted-foreground flex-1">
                    {item.description}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={fetchWebhookInfo} disabled={loading}>
                Actualizar Estado
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open(getBotLink(), '_blank')}
              >
                Probar Bot
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://core.telegram.org/bots/api', '_blank')}
              >
                Documentación API
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
