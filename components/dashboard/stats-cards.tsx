import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, CheckCircle, AlertTriangle, TrendingUp, Calendar } from "lucide-react"

interface StatsCardsProps {
  dateRange: string
  department: string
}

export function StatsCards({ dateRange, department }: StatsCardsProps) {
  // En producción, estos datos vendrían de la API
  const stats = {
    totalEmployees: 45,
    presentToday: 42,
    avgHoursWorked: 8.2,
    complianceRate: 95.5,
    lateArrivals: 3,
    totalHours: 1847,
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
      value: stats.totalHours.toString(),
      description: `En los últimos ${dateRange === "7d" ? "7 días" : dateRange === "30d" ? "30 días" : "días"}`,
      icon: Calendar,
      color: "text-indigo-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-gray-500 mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
