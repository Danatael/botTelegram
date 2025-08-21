import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

interface AttendanceRecord {
  id: string | number
  name: string
  department: string
  checkIn: string
  checkOut: string
  locationIn: string
  locationOut: string
  locationInValidado?: boolean
  locationOutValidado?: boolean
  status: string
  hours: number | string
}

interface AttendanceTableProps {
  limit?: number
}

export function AttendanceTable({ limit }: AttendanceTableProps) {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [mapCoords, setMapCoords] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [validating, setValidating] = useState(false)
  const [modalType, setModalType] = useState<'entrada' | 'salida' | null>(null)

  useEffect(() => {
    fetch("/api/asistencias/tabla")
      .then(res => res.json())
      .then(data => setAttendanceData(data))
  }, [])

  const displayData = limit ? attendanceData.slice(0, limit) : attendanceData

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completo":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completo</Badge>
      case "Tarde":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Tarde</Badge>
      case "Activo":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Activo</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const openMapModal = (coords: string, type: 'entrada' | 'salida' = 'entrada') => {
    setMapCoords(coords)
    setModalType(type)
    setModalOpen(true)
    setValidationMessage(null)
  }

  const closeMapModal = () => {
    setModalOpen(false)
    setMapCoords(null)
  }

  const handleValidate = async () => {
    if (!mapCoords || !modalType) return
    setValidating(true)
    setValidationMessage(null)
    try {
      const res = await fetch(`/api/asistencias/validar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coords: mapCoords, tipo: modalType }),
      })
      const data = await res.json()
      if (res.ok) {
        setValidationMessage('Validado correctamente')
        // Recargar datos de la tabla después de validar
        fetch("/api/asistencias/tabla")
          .then(res => res.json())
          .then(data => setAttendanceData(data))
      } else {
        setValidationMessage(data.error || 'Error al validar')
      }
    } catch (e) {
      setValidationMessage('Error de red al validar')
    } finally {
      setValidating(false)
    }
  }

  return (
    <div className="rounded-md border bg-black text-white">
      {/* Modal para el mapa */}
      {modalOpen && mapCoords && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-black text-white rounded-lg shadow-lg p-10 max-w-4xl w-full relative pointer-events-auto" style={{ margin: 'auto', top: '2vh', position: 'absolute', left: 0, right: 0 }}>
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
              height="600"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación"
            ></iframe>
            <div className="mt-4 text-base text-center text-gray-300">Coordenadas: {mapCoords}</div>
            {modalType && (
              <button
                className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
                onClick={handleValidate}
                disabled={validating}
              >
                {validating ? 'Validando...' : `Validar ${modalType === 'entrada' ? 'Entrada' : 'Salida'}`}
              </button>
            )}
            {validationMessage && (
              <div className="mt-2 text-center text-sm text-green-400">{validationMessage}</div>
            )}
          </div>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Empleado</TableHead>
            <TableHead className="text-white">Departamento</TableHead>
            <TableHead className="flex items-center gap-1 text-white">
              <Clock className="w-4 h-4 text-white" />
              Horario
            </TableHead>
            <TableHead className="text-white">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-white" />
                Ubicación
              </span>
            </TableHead>
            <TableHead className="text-white">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400 bg-black">Sin registros</TableCell>
            </TableRow>
          )}
          {displayData.map((record) => (
            <TableRow key={record.id} className="bg-black text-white">
              <TableCell>
                <div>
                  <div className="font-medium text-white">{record.name}</div>
                  <div className="text-sm text-gray-400">{record.id}</div>
                </div>
              </TableCell>
              <TableCell className="text-white">{record.department}</TableCell>
              <TableCell className="text-white">
                <div className="text-sm">
                  <div>Entrada: {record.checkIn}</div>
                  <div>Salida: {record.checkOut}</div>
                </div>
              </TableCell>
              <TableCell className="text-white">
                <div className="text-sm">
                  <div>
                    Entrada: {record.locationIn && record.locationIn !== '-' ? (
                      <>
                        <button
                          className="text-blue-400 underline hover:text-blue-200 cursor-pointer bg-transparent border-0 p-0"
                          onClick={() => openMapModal(record.locationIn, 'entrada')}
                          type="button"
                        >
                          {record.locationIn}
                        </button>
                        {typeof record.locationInValidado !== 'undefined' && (
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${record.locationInValidado ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            {record.locationInValidado ? 'Validado' : 'No validado'}
                          </span>
                        )}
                      </>
                    ) : (
                      record.locationIn || '-'
                    )}
                  </div>
                  <div>
                    Salida: {record.locationOut && record.locationOut !== '-' ? (
                      <>
                        <button
                          className="text-blue-400 underline hover:text-blue-200 cursor-pointer bg-transparent border-0 p-0"
                          onClick={() => openMapModal(record.locationOut, 'salida')}
                          type="button"
                        >
                          {record.locationOut}
                        </button>
                        {typeof record.locationOutValidado !== 'undefined' && (
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${record.locationOutValidado ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                            {record.locationOutValidado ? 'Validado' : 'No validado'}
                          </span>
                        )}
                      </>
                    ) : (
                      record.locationOut || '-'
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-white">{record.hours && record.hours !== 0 ? `${record.hours}h` : "-"}</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
