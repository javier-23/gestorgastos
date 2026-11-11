import { useEffect, useState } from 'react'
import { fetchApi } from '../api'
import type { Resumen } from '../types'

function mesActual() {
  const hoy = new Date()
  return `${String(hoy.getMonth() + 1).padStart(2, '0')}/${hoy.getFullYear()}`
}

function formatMes(mes: string) {
  const [month, year] = mes.split('/')
  return `${year}-${month}`
}

export function Summary() {
  const [mes, setMes] = useState(mesActual)
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!mes) return
    setError('')
    fetchApi(`/summary?month=${formatMes(mes)}`)
      .then(setResumen)
      .catch(err => setError(err.message))
  }, [mes])

  const restante = resumen?.remaining ?? 0
  const superado = restante < 0
  const porcentaje = resumen?.budget
    ? Math.min(100, (Math.abs(restante) / resumen.budget) * 100)
    : 0

  return (
    <div>
      <h2>Resumen mensual</h2>
      <input type="month" value={mes} placeholder="MM/YYYY" onChange={e => setMes(e.target.value)} />
      {error && <p>El mes es obligatorio, formato MM/YYYY</p>}

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
        </>
      )}
    </div>
  )
}