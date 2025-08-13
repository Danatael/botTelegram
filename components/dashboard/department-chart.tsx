"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface DepartmentChartProps {
  dateRange: string
}

export function DepartmentChart({ dateRange }: DepartmentChartProps) {
  const data = [
    { name: "Campo Norte", value: 12, color: "#2563eb" },
    { name: "Campo Sur", value: 10, color: "#0ea5e9" },
    { name: "Campo Centro", value: 8, color: "#06b6d4" },
    { name: "Oficina", value: 6, color: "#8b5cf6" },
    { name: "Mantenimiento", value: 5, color: "#10b981" },
    { name: "Supervisión", value: 4, color: "#f59e0b" },
  ]

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
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
