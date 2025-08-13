"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface ComplianceChartProps {
  type: "schedule" | "hours"
  dateRange: string
}

export function ComplianceChart({ type, dateRange }: ComplianceChartProps) {
  const scheduleData = [
    { day: "Lun", puntual: 38, tarde: 4, ausente: 3 },
    { day: "Mar", puntual: 40, tarde: 3, ausente: 2 },
    { day: "Mié", puntual: 37, tarde: 4, ausente: 4 },
    { day: "Jue", puntual: 42, tarde: 2, ausente: 1 },
    { day: "Vie", puntual: 39, tarde: 3, ausente: 3 },
    { day: "Sáb", puntual: 35, tarde: 2, ausente: 8 },
    { day: "Dom", puntual: 32, tarde: 1, ausente: 12 },
  ]

  const hoursData = [
    { day: "Lun", trabajadas: 8.2, requeridas: 8 },
    { day: "Mar", trabajadas: 8.5, requeridas: 8 },
    { day: "Mié", trabajadas: 7.8, requeridas: 8 },
    { day: "Jue", trabajadas: 8.3, requeridas: 8 },
    { day: "Vie", trabajadas: 8.1, requeridas: 8 },
    { day: "Sáb", trabajadas: 7.5, requeridas: 8 },
    { day: "Dom", trabajadas: 6.8, requeridas: 8 },
  ]

  const data = type === "schedule" ? scheduleData : hoursData

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-sm" />
          <YAxis axisLine={false} tickLine={false} className="text-sm" />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          {type === "schedule" ? (
            <>
              <Bar dataKey="puntual" stackId="a" fill="#10b981" name="Puntual" />
              <Bar dataKey="tarde" stackId="a" fill="#f59e0b" name="Tarde" />
              <Bar dataKey="ausente" stackId="a" fill="#ef4444" name="Ausente" />
            </>
          ) : (
            <>
              <Bar dataKey="trabajadas" fill="#2563eb" name="Horas Trabajadas" />
              <Bar dataKey="requeridas" fill="#94a3b8" name="Horas Requeridas" />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
