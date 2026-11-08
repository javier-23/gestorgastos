import { useState } from 'react'
import type { Categoria } from '../types'
import { fetchApi } from '../api'

interface ExpenseFormProps {
  token: string
  categorias: Categoria[]
  onCreated: () => void
}

export function ExpenseForm({ token, categorias, onCreated }: ExpenseFormProps) {
  const [date, setDate] = useState('')
  const [total, setTotal] = useState('')
  const [concept, setConcept] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [frequency, setFrequency] = useState('once')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    try {
        await fetchApi('/expenses', {
            method: 'POST',
            body: JSON.stringify({
                date,
                total: Number(total),
                concept: concept || null,
                id_category: Number(categoryId),
                frequency,
                end_date: frequency === 'once' ? null : endDate || null
            })
        })
        onCreated()
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Error')
    }
    
    setTotal('')
    setConcept('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nuevo gasto</h2>

      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <input type="number" step="0.50" placeholder="Importe" value={total} onChange={e => setTotal(e.target.value)} required />
      <input placeholder="Concepto" value={concept} onChange={e => setConcept(e.target.value)} />

      <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
        <option value="">Elige categoría</option>
        {categorias.map(c => 
            <option key={c.id} value={c.id}>{c.name}</option>
        )}
      </select>

      <select value={frequency} onChange={e => setFrequency(e.target.value)}>
        <option value="once">Puntual</option>
        <option value="weekly">Semanal</option>
        <option value="monthly">Mensual</option>
        <option value="yearly">Anual</option>
      </select>

      {frequency !== 'once' && (
        <input placeholder="Fecha fin" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      )}

      <button type="submit">Añadir</button>
      {error && <p>{error}</p>}
    </form>
  )
}