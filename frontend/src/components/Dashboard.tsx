import { useEffect, useState } from 'react'
import type { Categoria, Gasto } from '../types'
import { CategoryForm } from './CategoryForm'
import { ExpenseForm } from './ExpenseForm'
import { FRECUENCIAS, formatDate } from '../format.ts'
import { fetchApi } from '../api.ts';
import { Summary } from './Summary.tsx';

interface DashboardProps {
  token: string
  name: string
  onLogout: () => void
}

export function Dashboard({ token, name, onLogout }: DashboardProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [editando, setEditando] = useState<Gasto | null>(null) // Gasto que se está editando
  const [recarga, setRecarga] = useState(0)
  const [editandoCat, setEditandoCat] = useState<Categoria | null>(null)
  const [errorCategoria, setErrorCategoria] = useState('')

  useEffect(() => {
    fetchApi('/categories').then(
      setCategorias
    )
  }, [token, onLogout, recarga])

  useEffect(() => {
    fetchApi('/expenses').then(
      setGastos
    )
  }, [token, onLogout, recarga])

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

  async function borrarCategoria(id: number) {
    if (!window.confirm('¿Borrar esta categoría?')) return
    setErrorCategoria('')
    try {
      await fetchApi(`/categories/${id}`, { method: 'DELETE' })
      if (editandoCat?.id === id) setEditandoCat(null)
      setRecarga(r => r + 1)
    } catch (err) {
      setErrorCategoria(err instanceof Error ? err.message : 'Error')
    }
}

  return (
    <div>
      <h1>Estás dentro</h1>
      <h2>¡Bienvenido/a {name}!</h2>
      <button onClick={onLogout}>Cerrar sesión</button>

      {categorias.length === 0 && <p>No tienes categorías todavía</p>}
      {categorias.map(c => (
        <span key={c.id} style={{ marginRight: 12 }}>
          <span style={{ background: c.color, color: 'white', padding: '4px 10px', marginRight: 4 }}>
            {c.name}
          </span>
          <button onClick={() => { setErrorCategoria(''); setEditandoCat(c) }}>Editar</button>
          <button onClick={() => borrarCategoria(c.id)}>Borrar</button>
        </span>
      ))}
      {errorCategoria && <p>{errorCategoria}</p>}

      <CategoryForm
        key={editandoCat?.id ?? 'nueva'}
        categoria={editandoCat}
        onSaved={() => {
          setEditandoCat(null)
          setRecarga(r => r + 1)
        }}
        onCancel={() => setEditandoCat(null)}
      />
      
      <ExpenseForm
        key={editando?.id ?? 'nuevo'}
        categorias={categorias} 
        gasto={editando}
        onSaved={() => {
          setEditando(null)
          setRecarga(recarga + 1)}
        } 
        onCancel={() => setEditando(null)}
      />

      <Summary recarga={recarga} />

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