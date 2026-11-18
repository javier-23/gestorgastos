import { useEffect, useState } from 'react'
import { fetchApi } from '../api'
import { FRECUENCIAS, formatDate } from '../format'
import type { Ocurrencia } from '../types'

const MAX_GASTOS = 5

// del 1 al último día del mes; new Date(year, month, 0) es el día 0 del mes siguiente, o sea, el último de este
function rangoDelMes(mes: string) {
  const [year, month] = mes.split('-').map(Number)
  const ultimoDia = new Date(year, month, 0).getDate()
  return { from: `${mes}-01`, to: `${mes}-${String(ultimoDia).padStart(2, '0')}` }
}

interface TopExpensesProps {
  mes: string
  refrescar: number
}

export function TopExpenses({mes, refrescar}: TopExpensesProps){

    const [gastos, setGastos] = useState<Ocurrencia[]>([])
    const [error, setError] = useState('')

    useEffect(()=>{
        const {from, to} = rangoDelMes(mes)

        fetchApi(`/expenses/occurrences?from=${from}&to=${to}`)
            .then((datos: Ocurrencia[]) => setGastos(datos.slice(0, MAX_GASTOS)))
            .catch(err => { setError(err.message)
        })

    },[refrescar])

    return(
        <section style={{border:'1px solid white'}}>
            <h4>Últimos gastos del mes</h4>
            {error && <p>{error}</p>}
            {!error && gastos.length === 0 && <p>Sin gastos este mes</p>}

            <ol style={{ listStyle: 'none', padding: 0, margin: 0}}>
                <li style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
                    <span>CONCEPTO</span>
                    <span>CATEGORÍA</span>
                    <span>TIPO</span>
                    <span>FECHA</span>
                    <span>IMPORTE</span>
                </li>
                {gastos.map(g => 
                    <li 
                        key={g.id}
                        style={{display: 'flex', alignItems: 'center',justifyContent: 'center', gap: 12, borderBottom: '1px solid #f3f4f6'}}
                    >
                        <span>{g.concept ?? 'Sin concepto'}</span>
                        <span style={{ background: g.category_color, color: 'white', padding: '2px 8px', borderRadius: 4 }}>
                            {g.category_name}
                        </span>
                        <span>{FRECUENCIAS[g.frequency]}</span>
                        <span>{formatDate(g.occurrence_date)}</span>
                        <span>{g.total}</span>
                    </li>
                )}
            </ol>

        </section>
    )
}