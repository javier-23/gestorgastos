import { useEffect, useState } from 'react'
import { fetchApi } from '../api'
import { FRECUENCIAS, formatDate } from '../format'
import type { Ocurrencia } from '../types'

const MAX_GASTOS = 5

interface TopExpensesProps {
  mes: string
  refrescar: number
}

export function TopExpenses({mes, refrescar}: TopExpensesProps){

    const [gastos, setGastos] = useState<Ocurrencia[]>([])
    const [error, setError] = useState('')

    return(
        <section style={{border:'1px solid white'}}>
            <h4>Últimos gastos del mes</h4>
            {error && <p>{error}</p>}
            {!error && gastos.length === 0 && <p>Sin gastos este mes</p>}

        </section>
    )
}