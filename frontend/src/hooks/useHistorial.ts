// Hook personalizado para obtener el historial de los últimos 6 meses a partir de un mes dado
import { useEffect, useState } from 'react'
import { fetchApi } from '../api'
import type { Resumen } from '../types'
import type { PuntoHistorial } from '../components/LinealChart.tsx'
import { cambiarMes } from '../format.ts'

function nombreMesCorto(mes: string) {
  const [year, month] = mes.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('es-ES', { month: 'short' })
}

export function useHistorial(mes: string, refrescar: number) {
  const [historial, setHistorial] = useState<PuntoHistorial[]>([])
  const [errorHistorial, setErrorHistorial] = useState('')

  useEffect(() => {
    const meses = [-5, -4, -3, -2, -1, 0].map(d => cambiarMes(mes, d))

    // Obtener los resúmenes de los últimos 6 meses a la vez
    Promise.all(meses.map(m => fetchApi(`/summary?month=${m}`)))
      .then((resumenes: Resumen[]) => {
        setErrorHistorial('')
        setHistorial(resumenes.map((r, i) => ({ // r es el resumen de cada mes, i es el índice del mes
          mes: nombreMesCorto(meses[i]),
          ingresos: r.budget ?? 0,
          gastos: r.spent,
          ahorro: r.remaining
        })))
      })
      .catch(err => setErrorHistorial(err.message))
  }, [mes, refrescar])

  return { historial, errorHistorial }
}