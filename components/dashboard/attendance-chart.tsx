"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface AttendanceChartProps {
  dateRange: string
}

export function AttendanceChart({ dateRange }: AttendanceChartProps) {
  // Datos simulados - en producción vendrían de la API
  const data = [
    { date: "Lun", asistencia: 42, meta: 45 },
    { date: "Mar", asistencia: 44, meta: 45 },
    { date: "Mié", asistencia: 41, meta: 45 },
    { date: "Jue", asistencia: 45, meta: 45 },
    { date: "Vie", asistencia: 43, meta: 45 },
    { date: "Sáb", asistencia: 38, meta: 45 },
    { date: "Dom", asistencia: 35, meta: 45 },
  ]

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-sm" />
          <YAxis axisLine={false} tickLine={false} className="text-sm" />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="asistencia"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
            name="Asistencia Real"
          />
          <Line
            type="monotone"
            dataKey="meta"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Meta"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
