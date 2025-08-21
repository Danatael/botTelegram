import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, CheckCircle, AlertTriangle, TrendingUp, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

interface StatsCardsProps {
  dateRange: string
  department: string
}

export function StatsCards({ dateRange, department }: StatsCardsProps) {
  const [presentToday, setPresentToday] = useState<number | null>(null)
  const [totalEmployees, setTotalEmployees] = useState<number | null>(null)
  const [avgHoursWorked, setAvgHoursWorked] = useState<number | null>(null)
  const [totalHours, setTotalHours] = useState<number | null>(null)
  const [complianceRate, setComplianceRate] = useState<number | null>(null)

  useEffect(() => {
    // Obtener presentes hoy
    fetch("/api/asistencias/presentes")
      .then((res) => res.json())
      .then((data) => setPresentToday(data.presentes))
    // Obtener empleados totales desde la tabla empleados
    fetch("/api/empleados")
      .then((res) => res.json())
      .then((data) => setTotalEmployees(Array.isArray(data) ? data.length : null))
    // Obtener horas promedio trabajadas hoy
    fetch("/api/asistencias/horas-promedio")
      .then((res) => res.json())
      .then((data) => setAvgHoursWorked(typeof data.promedio === 'number' ? data.promedio : null))
    // Obtener horas totales trabajadas en el mes actual
    fetch("/api/asistencias/horas-totales")
      .then((res) => res.json())
      .then((data) => setTotalHours(typeof data.total === 'number' ? data.total : null))
    // Obtener porcentaje de cumplimiento (8h+)
    fetch("/api/asistencias/cumplimiento")
      .then((res) => res.json())
      .then((data) => setComplianceRate(Number(data.cumplimiento)))
  }, [])

  // En producción, estos datos vendrían de la API
  const stats = {
    totalEmployees: totalEmployees ?? 0,
    presentToday: presentToday ?? 0,
    avgHoursWorked: avgHoursWorked ?? 0,
    complianceRate: complianceRate ?? 0,
    lateArrivals: 3,
    totalHours: totalHours ?? 0,
  }

  const cards = [
    {
      title: "Empleados Totales",
      value: stats.totalEmployees.toString(),
      description: "Personal activo registrado",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Presentes Hoy",
      value: stats.presentToday.toString(),
      description: `${((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)}% de asistencia`,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Horas Promedio",
      value: stats.avgHoursWorked.toFixed(1),
      description: "Horas trabajadas por día",
      icon: Clock,
      color: "text-purple-600",
    },
    {
      title: "Cumplimiento",
      value: `${stats.complianceRate}%`,
      description: "Cumplimiento normativo",
      icon: TrendingUp,
      color: "text-emerald-600",
    },
    {
      title: "Llegadas Tarde",
      value: stats.lateArrivals.toString(),
      description: "En el día de hoy",
      icon: AlertTriangle,
      color: "text-orange-600",
    },
    {
      title: "Horas Totales",
      value: stats.totalHours.toFixed(1),
      description: `En el mes actual`,
      icon: Calendar,
      color: "text-indigo-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <p className="text-xs text-gray-300 mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function PresentesHoyCard() {
  const [presentToday, setPresentToday] = useState<number | null>(null)

  useEffect(() => {
    const fetchPresentes = () => {
      fetch("/api/asistencias/presentes")
        .then((res) => res.json())
        .then((data) => setPresentToday(data.presentes))
    }
    fetchPresentes()
    const interval = setInterval(fetchPresentes, 1000) // Actualiza cada 1 segundo
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" /> Presentes Hoy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-center">
          {presentToday === null ? '—' : presentToday}
        </div>
      </CardContent>
    </Card>
  )
}
