import { useEffect, useState } from 'react'
import type { Categoria, Gasto } from '../types'
import { ExpenseForm } from '../components/ExpenseForm.tsx'
import { FRECUENCIAS, formatDate } from '../format'
import { fetchApi } from '../api'

export function ExpensesPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [editando, setEditando] = useState<Gasto | null>(null)
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    fetchApi('/categories').then(setCategorias)
  }, [])

  useEffect(() => {
    fetchApi('/expenses').then(setGastos)
  }, [recarga])

  async function borrarGasto(id: number) {
    if (!window.confirm('¿Borrar este gasto? Si es recurrente, se borran todas sus repeticiones.')) return
    try {
      await fetchApi(`/expenses/${id}`, { method: 'DELETE' })
      if (editando?.id === id) setEditando(null)
      setRecarga(r => r + 1)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error')
    }
  }

  return (
    <div>
      <ExpenseForm
        key={editando?.id ?? 'nuevo'}
        categorias={categorias}
        gasto={editando}
        onSaved={() => {
          setEditando(null)
          setRecarga(r => r + 1)
        }}
        onCancel={() => setEditando(null)}
      />

      <h2>Gastos</h2>
      {gastos.length === 0 && <p>No tienes gastos todavía</p>}
      {gastos.map(g => (
        <div key={g.id}>
          <span style={{ background: g.category_color, color: 'white', padding: '2px 8px', marginRight: 8 }}>
            {g.category_name}
          </span>
          <p>{formatDate(g.date)} · {g.concept ?? 'Sin concepto'} · {g.total} € · {FRECUENCIAS[g.frequency]}</p>
          <button onClick={() => setEditando(g)}>Editar</button>
          <button onClick={() => borrarGasto(g.id)}>Borrar</button>
        </div>
      ))}
    </div>
  )
}