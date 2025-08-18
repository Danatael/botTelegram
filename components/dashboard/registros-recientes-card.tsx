import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface RegistroReciente {
  id: number
  hora_entrada: string
  ubicacion_entrada?: string | null
  hora_salida?: string | null
  ubicacion_salida?: string | null
  empleado: {
    nombre: string
    departamento?: string | null
    codigo_empleado?: string | null
  }
  // Puedes agregar más campos si tu backend los provee
  // horas?: string | null
  // estado?: string | null
}

export function RegistrosRecientesCard() {
  const [registros, setRegistros] = useState<RegistroReciente[]>([])

  useEffect(() => {
    fetch("/api/asistencias/recientes")
      .then(res => res.json())
      .then(data => setRegistros(data))
  }, [])

  return (
    <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">Registros Recientes</CardTitle>
        <p className="text-xs text-gray-400">Últimos registros de asistencia del sistema</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 px-2">Empleado</th>
                <th className="py-2 px-2">Departamento</th>
                <th className="py-2 px-2">Horario</th>
                <th className="py-2 px-2">Ubicación</th>
                <th className="py-2 px-2">Horas</th>
                <th className="py-2 px-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-400">Sin registros recientes</td>
                </tr>
              )}
              {registros.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2 px-2">
                    <div className="font-semibold">{r.empleado?.nombre ?? '—'}</div>
                    <div className="text-xs text-gray-400">{r.empleado?.codigo_empleado ?? ''}</div>
                  </td>
                  <td className="py-2 px-2">{r.empleado?.departamento || 'Sin departamento'}</td>
                  <td className="py-2 px-2">
                    <span className="block">Entrada: <span className="font-mono">{r.hora_entrada || '-'}</span></span>
                    {r.hora_salida && r.hora_salida !== '-' && (
                      <span className="block">Salida: <span className="font-mono">{r.hora_salida}</span></span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    <span className="block">Entrada: <span className="font-mono">{r.ubicacion_entrada || '-'}</span></span>
                    {r.ubicacion_salida && r.ubicacion_salida !== '-' && (
                      <span className="block">Salida: <span className="font-mono">{r.ubicacion_salida}</span></span>
                    )}
                  </td>
                  <td className="py-2 px-2">-</td>
                  <td className="py-2 px-2">
                    <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700">Completo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
