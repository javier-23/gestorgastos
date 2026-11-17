import { PieChart, Pie, Label, Tooltip, ResponsiveContainer, Sector} from 'recharts'
import type { PieSectorShapeProps } from 'recharts'
const MAX_CATEGORIAS = 5 // Numero max de categorías a mostrar con su nombre
interface CategoriaTotal {
    id: number
    name: string
    color: string
    total: number
}

interface CategoriaDonutProps {
    datos: CategoriaTotal[]
    totalGastos: number
}

export function CategoryDonut({ datos, totalGastos }: CategoriaDonutProps) {
    if (datos.length === 0) return null

    // el backend envía total como texto ("120.00"); el gráfico necesita números
    const todas = datos.map(c => ({name: c.name, total: Number(c.total), color: c.color }))

    // Para mostrar las 5 principales categorías y el resto agrupadas en una sola
    let data = todas
    if (todas.length > MAX_CATEGORIAS){
      const principales = todas.slice(0, MAX_CATEGORIAS)
      const resto = todas.slice(MAX_CATEGORIAS)
      data = [
        ...principales,
        {
          name: `Otras categorias`,
          total: resto.reduce((suma, c) => suma + c.total, 0), //  array1.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);
          color: '#9CA3AF'
        }
      ]
    }

    // Recharts llama a esta función una vez por sector; props.index es su posición en data
    function SectorColoreado(props: PieSectorShapeProps) {
      return <Sector {...props} fill={data[props.index]?.color ?? '#9CA3AF'} />
    }

    return (
    <section style={{ border: '1px solid #e5e7eb', padding: 12, marginBottom: 12 }}>
      <h4>Gasto por categoría</h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="name" innerRadius={60} outerRadius={100} shape={SectorColoreado}>
            <Label value={`Total: ${totalGastos}€`} position="center" />
            <Tooltip />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <ul style={{listStyle: 'none', padding: 0, margin: 10}}>
        {data.map((c,i) => (
            <li
              key={i}
              style={{display:'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}
            >
              <span 
                aria-hidden="true"
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: c.color,
              }}/>
              <span>{c.name}</span>
              <span>{c.total}€</span>
          </li>
        ))}
      </ul>
    </section>
  )
}