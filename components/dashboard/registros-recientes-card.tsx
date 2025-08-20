import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface RegistroReciente {
  id: number
  hora_entrada: string
  ubicacion_entrada?: string | null
  hora_salida?: string | null
  ubicacion_salida?: string | null
  validado_entrada?: boolean
  validado_salida?: boolean
  empleado: {
    nombre: string
    departamento?: string | null
    codigo_empleado?: string | null
  }
}

export function RegistrosRecientesCard() {
  const [registros, setRegistros] = useState<RegistroReciente[]>([])
  const [mapCoords, setMapCoords] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

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

  const openMap = (coords: string) => {
    setMapCoords(coords)
    setModalOpen(true)
  }
  const closeMapModal = () => {
    setModalOpen(false)
    setMapCoords(null)
  }

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
                <th className="py-2 px-2">Validación</th>
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
                  <td className="py-2 px-2 text-white">{r.empleado?.departamento || '-'}</td>
                  <td className="py-2 px-2 text-white">
                    <span className="block">Entrada: <span className="font-mono">{r.hora_entrada || '-'}</span></span>
                    {r.hora_salida && r.hora_salida !== '-' && (
                      <span className="block">Salida: <span className="font-mono">{r.hora_salida}</span></span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-white">
                    <span className="block">Entrada: {r.ubicacion_entrada && r.ubicacion_entrada !== '-' ? (
                      <button onClick={() => openMap(r.ubicacion_entrada!)} className="text-blue-400 underline hover:text-blue-300">{r.ubicacion_entrada}</button>
                    ) : <span className="text-gray-400">-</span>}</span>
                    {r.ubicacion_salida && r.ubicacion_salida !== '-' && (
                      <span className="block">Salida: <button onClick={() => openMap(r.ubicacion_salida!)} className="text-blue-400 underline hover:text-blue-300">{r.ubicacion_salida}</button></span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${r.validado_entrada ? 'bg-green-700 text-white' : 'bg-red-600 text-white'}`}>{r.validado_entrada ? 'Entrada validada' : 'No validado'}</span>
                      {r.hora_salida && r.ubicacion_salida && (
                        <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${r.validado_salida ? 'bg-green-700 text-white' : 'bg-red-600 text-white'}`}>{r.validado_salida ? 'Salida validada' : 'No validado'}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {modalOpen && mapCoords && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-black text-white rounded-lg shadow-lg p-10 max-w-2xl w-full relative pointer-events-auto" style={{ margin: 'auto', top: '2vh', position: 'absolute', left: 0, right: 0 }}>
              <button
                className="absolute top-2 right-2 text-gray-300 hover:text-white text-3xl"
                onClick={closeMapModal}
                aria-label="Cerrar"
              >
                ×
              </button>
              <div className="mb-4 font-semibold text-center text-xl">Ubicación en el mapa</div>
              <iframe
                src={`https://maps.google.com/maps?q=${mapCoords}&z=17&output=embed`}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de ubicación"
              />
              <div className="mt-4 text-base text-center text-gray-300">Coordenadas: {mapCoords}</div>
              <div className="mt-2 text-xs text-gray-400 text-center">
                <a href={mapCoords ? `https://maps.google.com/?q=${mapCoords}` : '#'} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">Ver en Google Maps</a>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
