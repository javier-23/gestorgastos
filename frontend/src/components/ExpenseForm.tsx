import { useState } from 'react'
import type { Categoria, Gasto } from '../types'
import { fetchApi } from '../api'

interface ExpenseFormProps {
  categorias: Categoria[]
  gasto?: Gasto | null
  onSaved: () => void
  onCancel?: () => void
}

export function ExpenseForm({categorias, gasto, onSaved, onCancel }: ExpenseFormProps) {
  const [date, setDate] = useState(gasto?.date ?? '')
  const [total, setTotal] = useState(gasto?.total ?? '')
  const [concept, setConcept] = useState(gasto?.concept ?? '')
  const [categoryId, setCategoryId] = useState(gasto ? String(gasto.category_id) : '')
  const [frequency, setFrequency] = useState(gasto?.frequency ?? 'once')
  const [endDate, setEndDate] = useState(gasto?.end_date ?? '')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    try {
        await fetchApi(gasto ? `/expenses/${gasto.id}` : '/expenses', {
            method: gasto ? 'PUT' : 'POST',
            body: JSON.stringify({
                date,
                total: Number(total),
                concept: concept || null,
                id_category: Number(categoryId),
                frequency,
                end_date: frequency === 'once' ? null : endDate || null
            })
        })
        setTotal('')
        setConcept('')
        onSaved()
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{gasto ? 'Editar gasto' : 'Nuevo gasto'}</h2>

      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <input type="number" step="0.01" placeholder="Importe" value={total} onChange={e => setTotal(e.target.value)} required />
      <input placeholder="Concepto" value={concept} onChange={e => setConcept(e.target.value)} />

      <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
        <option value="">Elige categoría</option>
        {categorias.map(c => 
            <option key={c.id} value={c.id}>{c.name}</option>
        )}
      </select>

      <select value={frequency} onChange={e => setFrequency(e.target.value as typeof frequency)}>
        <option value="once">Puntual</option>
        <option value="weekly">Semanal</option>
        <option value="monthly">Mensual</option>
        <option value="yearly">Anual</option>
      </select>

      {frequency !== 'once' && (
        <input placeholder="Fecha fin" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      )}

      <button type="submit">{gasto ? 'Guardar cambios' : 'Añadir'}</button>
      {gasto && onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
      {error && <p>{error}</p>}
    </form>
  )
}