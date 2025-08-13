import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"

interface AttendanceTableProps {
  limit?: number
}

export function AttendanceTable({ limit }: AttendanceTableProps) {
  // Datos simulados - en producción vendrían de la API
  const attendanceData = [
    {
      id: "EMP001",
      name: "Juan Pérez",
      department: "Campo Norte",
      checkIn: "08:00",
      checkOut: "17:15",
      location: "Obra Central",
      status: "Completo",
      hours: 9.25,
    },
    {
      id: "EMP002",
      name: "María González",
      department: "Oficina",
      checkIn: "08:15",
      checkOut: "17:00",
      location: "Oficina Principal",
      status: "Tarde",
      hours: 8.75,
    },
    {
      id: "EMP003",
      name: "Carlos Rodríguez",
      department: "Campo Sur",
      checkIn: "07:45",
      checkOut: "16:30",
      location: "Obra Sur",
      status: "Completo",
      hours: 8.75,
    },
    {
      id: "EMP004",
      name: "Ana Martínez",
      department: "Mantenimiento",
      checkIn: "08:30",
      checkOut: "-",
      location: "Almacén",
      status: "Activo",
      hours: 0,
    },
    {
      id: "EMP005",
      name: "Luis Hernández",
      department: "Campo Centro",
      checkIn: "08:00",
      checkOut: "17:30",
      location: "Campo Remoto",
      status: "Completo",
      hours: 9.5,
    },
  ]

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empleado</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Horario
            </TableHead>
            <TableHead className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Ubicación
            </TableHead>
            <TableHead>Horas</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{record.name}</div>
                  <div className="text-sm text-gray-500">{record.id}</div>
                </div>
              </TableCell>
              <TableCell>{record.department}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>Entrada: {record.checkIn}</div>
                  <div>Salida: {record.checkOut}</div>
                </div>
              </TableCell>
              <TableCell>{record.location}</TableCell>
              <TableCell>{record.hours > 0 ? `${record.hours}h` : "-"}</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
