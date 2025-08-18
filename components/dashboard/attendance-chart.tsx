"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"

interface AttendanceChartProps {
  dateRange: string
}

export function AttendanceChart({ dateRange }: AttendanceChartProps) {
  // Estado para datos reales
  const [data, setData] = useState([
    { date: "Lun", asistencia: 0, meta: 25 },
    { date: "Mar", asistencia: 0, meta: 25 },
    { date: "Mié", asistencia: 0, meta: 25 },
    { date: "Jue", asistencia: 0, meta: 25 },
    { date: "Vie", asistencia: 0, meta: 25 },
    { date: "Sáb", asistencia: 0, meta: 25 },
    { date: "Dom", asistencia: 0, meta: 25 },
  ])

  useEffect(() => {
    // Aquí deberías hacer fetch a tu API real para obtener los datos de asistencia por día
    // Ejemplo de fetch simulado:
    fetch(`/api/asistencias/por-dia?dateRange=${dateRange}`)
      .then((res) => res.ok ? res.json() : Promise.resolve([]))
      .then((result) => {
        // result debe ser un array tipo: [{ date: 'Lun', asistencia: 18 }, ...]
        // Mapear para asegurar que siempre hay 7 días y meta=25
        const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
        const dataMap = dias.map((dia) => {
          const found = result.find((r: any) => r.date === dia)
          return { date: dia, asistencia: found ? found.asistencia : 0, meta: 25 }
        })
        setData(dataMap)
      })
      .catch(() => {})
  }, [dateRange])

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-sm" />
          <YAxis domain={[0, 25]} axisLine={false} tickLine={false} className="text-sm" />
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
            name="Empleados Registrados"
          />
          <Line
            type="monotone"
            dataKey="meta"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Meta (25)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
