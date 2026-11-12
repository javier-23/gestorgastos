import { useEffect, useState } from 'react'
import { fetchApi } from '../api'
import type { Resumen } from '../types'
import { Budget } from './Budget.tsx';

// Función para obtener el mes actual en formato YYYY-MM (base de datos)
function mesActual() {
  const hoy = new Date()
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
}

interface SummaryProps {
  recarga: number
}
export function Summary({ recarga }: SummaryProps) {
  const [mes, setMes] = useState(mesActual)
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [error, setError] = useState('')
  const [guardado, setGuardado] = useState(0)

  // Función para cambiar el mes actual en la vista según el delta (1 para siguiente mes, -1 para mes anterior)
  function cambiarMes(mes: string, delta: number) {
    const [year, month] = mes.split('-').map(Number)
    const newDate = new Date(year, month - 1 + delta, 1)
    setMes(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`)
  }

  // Función para obtener el nombre del mes en formato largo a partir del formato YYYY-MM
  function nombreMes(mes: string) {
    const [year, month] = mes.split('-').map(Number)
    const date = new Date(year, month - 1, 1)
    return date.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
  }

  useEffect(() => {
    if (!mes) return
    setError('')
    fetchApi(`/summary?month=${mes}`)
      .then(setResumen)
      .catch(err => setError(err.message))
  }, [mes, recarga, guardado])

  const restante = resumen?.remaining ?? 0
  const superado = restante < 0
  const porcentaje = resumen?.budget
    ? Math.min(100, (Math.abs(restante) / resumen.budget) * 100)
    : 0

  return (
    <div>
      <h2>Resumen mensual</h2>
      <button onClick={() => cambiarMes(mes, -1)} aria-label="Mes anterior">Mes anterior</button>
      <span style={{ margin: '0 12px' }}>{nombreMes(mes)}</span>
      <button onClick={() => cambiarMes(mes, 1)} aria-label="Mes siguiente">Mes siguiente</button>
      {error && <p>{error}</p>}

      {resumen && (
        <>
        <section style={{ flexDirection: 'row', display: 'flex', justifyContent: 'center' }}>
          <div style={{ border: '1px solid #e5e7eb', padding: 12, marginBottom: 12 }}>
            <h4>Total Gasto</h4>
            <p>{resumen.spent}€</p>
          </div>
        
          <div style={{ border: '1px solid #e5e7eb', padding: 12, marginBottom: 12 }}>
            {resumen.budget === null ? (
              <p>No hay presupuesto para este mes</p>
            ) : (
              <>
                <h4>Presupuesto</h4>
                <p>{resumen.budget}€</p>
              </>
            )}
          </div>
          
          <div style={{ border: '1px solid #e5e7eb', padding: 12, marginBottom: 12 }}>
            <h4>{superado ? 'Te has pasado en ' : 'Ahorro '}</h4>
            <p>{Math.abs(restante)}€</p>
          </div>
        </section>

        
        <section style={{ border: '1px solid #e5e7eb', padding: 12, marginBottom: 12 }}>
            <h4>Progreso del presupuesto</h4>
              {resumen.budget === null ? (<p>Sin datos</p>) : (null)}
              <div style={{ background: '#e5e7eb', height: 12, borderRadius: 6 }}>
                <div
                  style={{
                    width: `${porcentaje}%`,
                    height: '100%',
                    borderRadius: 6,
                    background: superado ? '#EF4444' : '#22C55E'
                  }}
                />
              </div>
        </section>

        <h3>Por categoría</h3>
        {resumen.byCategory.length === 0 && <p>Sin gastos este mes</p>}
        {resumen.byCategory.map(c => (
          <p key={c.id}>
            <span style={{ background: c.color, color: 'white', padding: '2px 8px', marginRight: 8 }}>
              {c.name}
            </span>
            {c.total}€
          </p>
        ))}

        <Budget mes={mes} onSaved={() => setGuardado(g => g + 1)} />
        </>
      )}
    </div>
  )
}