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
      .then(data => {
        if (Array.isArray(data)) {
          setRegistros(data)
        } else if (data && Array.isArray(data.recientes)) {
          setRegistros(data.recientes)
        } else {
          setRegistros([])
        }
      })
  }, [])

  return (
    <Card className="bg-black text-white flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-white">Registros Recientes</CardTitle>
        <p className="text-xs text-gray-300">Últimos registros de asistencia del sistema</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-black text-white">
            <thead>
              <tr className="text-left text-gray-300 border-b border-gray-700">
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
                  <td colSpan={6} className="py-4 text-center text-gray-400 bg-black">Sin registros recientes</td>
                </tr>
              )}
              {Array.isArray(registros) && registros.map((r) => (
                <tr key={r.id} className="border-b border-gray-700 last:border-0">
                  <td className="py-2 px-2">
                    <div className="font-semibold text-white">{r.empleado?.nombre ?? '—'}</div>
                    <div className="text-xs text-gray-400">{r.empleado?.codigo_empleado ?? ''}</div>
                  </td>
                  <td className="py-2 px-2 text-white">{r.empleado?.departamento || 'Sin departamento'}</td>
                  <td className="py-2 px-2 text-white">
                    <span className="block">Entrada: <span className="font-mono">{r.hora_entrada || '-'}</span></span>
                    {r.hora_salida && r.hora_salida !== '-' && (
                      <span className="block">Salida: <span className="font-mono">{r.hora_salida}</span></span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-white">
                    <span className="block">Entrada: <span className="font-mono">{r.ubicacion_entrada || '-'}</span></span>
                    {r.ubicacion_salida && r.ubicacion_salida !== '-' && (
                      <span className="block">Salida: <span className="font-mono">{r.ubicacion_salida}</span></span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-white">-</td>
                  <td className="py-2 px-2">
                    <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-green-700 text-white">Completo</span>
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
