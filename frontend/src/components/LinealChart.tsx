import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export interface PuntoHistorial {
  mes: string
  ingresos: number
  gastos: number
  ahorro: number | null
}

interface HistoryChartProps {
  datos: PuntoHistorial[]
}

export function LinealChart({ datos }: HistoryChartProps) {
  if (datos.length === 0) return null

  return (
    <section style={{ border: '1px solid #e5e7eb', padding: 12, marginBottom: 12 }}>
      <h4>Ingresos vs gastos (últimos 6 meses)</h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={datos}>
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ingresos" name="Ingresos" stroke="#22C55E" />
          <Line type="monotone" dataKey="gastos" name="Gastos" stroke="#EF4444" />
        </LineChart>
      </ResponsiveContainer>
    </section>
  )
}