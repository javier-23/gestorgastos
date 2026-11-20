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

        fetchApi(`/expenses/occurrences?from=${from}&to=${to}&limit=${MAX_GASTOS}`)
            .then((datos: Ocurrencia[]) => setGastos(datos))
            .catch(err => { setError(err.message)
        })

    },[mes,refrescar])

    return(
        <div style={{border:'1px solid white'}}>
            <h4>Últimos gastos del mes</h4>
            {error && <p>{error}</p>}
            {!error && gastos.length === 0 && <p>Sin gastos este mes</p>}

            {gastos.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '8px 4px' }}>Concepto</th>
                        <th style={{ padding: '8px 4px' }}>Categoría</th>
                        <th style={{ padding: '8px 4px' }}>Frecuencia</th>
                        <th style={{ padding: '8px 4px' }}>Fecha</th>
                        <th style={{ padding: '8px 4px', textAlign: 'right' }}>Importe</th>
                    </tr>
                </thead>
                <tbody>
                    {gastos.map(g => (
                        <tr key={`${g.id}-${g.date}`} style={{ textAlign: 'left',borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '8px 4px' }}>{g.concept ?? 'Sin concepto'}</td>
                            <td style={{ padding: '8px 4px' }}>
                                <span style={{ background: g.category_color, color: 'white', padding: '2px 8px', borderRadius: 4 }}>
                                {g.category_name}
                                </span>
                            </td>
                            <td style={{ padding: '8px 4px' }}>{FRECUENCIAS[g.frequency]}</td>
                            <td style={{ padding: '8px 4px' }}>{formatDate(g.date)}</td>
                            <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                                <strong>{Number(g.total).toFixed(2)} €</strong>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}

        </div>
    )
}