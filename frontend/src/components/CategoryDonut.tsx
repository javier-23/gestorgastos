import { PieChart, Pie, Label, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoriaTotal {
    id: number
    name: string
    color: string
    total: number
}

interface CategoriaDonutProps {
    datos: CategoriaTotal[]
}

export function CategoryDonut({ datos }: CategoriaDonutProps) {
    if (datos.length === 0) return null

    return (
    <section style={{ border: '1px solid #e5e7eb', padding: 12, marginBottom: 12 }}>
      <h4>Gasto por categoría</h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={datos} dataKey="total" nameKey="name" innerRadius={60} outerRadius={90}>
            <Label position="center">Total: 223€</Label>
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </section>
  )
}