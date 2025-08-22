"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useEffect, useState } from "react"

interface DepartmentChartProps {
  dateRange: string
  roles?: string[]
}

export function DepartmentChart({ dateRange, roles = ["VENDEDOR", "INSTALADOR", "EMPLEADO", "ATNCTE"] }: DepartmentChartProps) {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch(`/api/asistencias/por-rol?dateRange=${dateRange}`)
      .then(r => r.json())
      .then(setData)
  }, [dateRange])

  const colors = ["#2563eb", "#0ea5e9", "#06b6d4", "#8b5cf6"]

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
