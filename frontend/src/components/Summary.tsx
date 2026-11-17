import { useEffect, useState } from 'react'
import { fetchApi } from '../api'
import type { Resumen } from '../types'
import { Budget } from './Budget.tsx';
import { cambiarMes, nombreMes } from '../format.ts'
import { LinealChart } from './LinealChart.tsx'
import { useHistorial } from '../hooks/useHistorial.ts'
import { Comparasion } from './Comparasion.tsx'
import { CategoryDonut} from './CategoryDonut.tsx'

// Función para obtener el mes actual en formato YYYY-MM (base de datos)
function mesActual() {
  const hoy = new Date()
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`
}

interface SummaryProps {
  recarga: number
}

// Recarga: número que se incrementa cada vez que se guarda un gasto
export function Summary({ recarga }: SummaryProps) {
  const [mes, setMes] = useState(mesActual)
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [error, setError] = useState('')
  const [guardado, setGuardado] = useState(0) // Para forzar la recarga del resumen cuando se guarda un presupuesto
  const { historial, error: errorHistorial } = useHistorial(mes, recarga + guardado)

  const mesAnterior = cambiarMes(mes, -1)

  // Calcular las diferencias de gasto y ahorro entre el mes actual y el anterior
  const actual = historial[5] // El mes actual es el último del historial
  const anterior = historial[4] // El mes anterior es el penúltimo del historial
  const difGasto = actual && anterior && anterior.gastos != 0 ? // Se pone anterior.gastos != 0 para evitar división por cero (no sale NaN ni Infinity)
                      (actual.gastos - anterior.gastos)/anterior.gastos * 100  
                      : null
  const difAhorro = actual?.ahorro != null && anterior?.ahorro != null && anterior?.ahorro != 0 ? // Se pone anterior.ahorro != 0 para evitar división por cero (no sale NaN ni Infinity)
                      (actual.ahorro - anterior.ahorro)/anterior.ahorro * 100 
                      : null

  useEffect(() => {
    if (!mes) return
    setError('')
    fetchApi(`/summary?month=${mes}`)
      .then(setResumen)
      .catch(err => setError(err.message))
  }, [mes, recarga, guardado])

  // Calcular el ahorro (presupuesto-gasto) y si se ha superado o no
  const restante = resumen?.remaining ?? 0
  const superado = restante < 0
  const porcentaje = resumen?.budget
    ? Math.min(100, (Math.abs(restante) / resumen.budget) * 100)
    : 0

  return (
    <div>
      <h2>Resumen mensual</h2>
      <button onClick={() => setMes(cambiarMes(mes, -1))} aria-label="Mes anterior">Mes anterior</button>
      <span style={{ margin: '0 12px' }}>{nombreMes(mes)}</span>
      <button onClick={() => setMes(cambiarMes(mes, 1))} aria-label="Mes siguiente">Mes siguiente</button>
      {error && <p>{error}</p>}

      {resumen && (
        <>
        <section style={{ flexDirection: 'row', display: 'flex', justifyContent: 'center' }}>
          <div style={{ border: '1px solid #e5e7eb', padding: 12, marginBottom: 12 }}>
            <h4>Total Gasto</h4>
            <p>{resumen.spent}€</p>
            {difGasto !== null && (
              <Comparasion diff={difGasto} mes={nombreMes(mesAnterior)} subirEsBueno={false} />
            )}
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
            {difAhorro !== null && (
              <Comparasion diff={difAhorro} mes={nombreMes(mesAnterior)} subirEsBueno={true} />
            )}
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

        <LinealChart datos={historial} />

        <CategoryDonut datos={resumen.byCategory} totalGastos={resumen.spent} />
        </>
      )}
    </div>
  )
}