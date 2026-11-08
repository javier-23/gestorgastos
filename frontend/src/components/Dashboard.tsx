import { useEffect, useState } from 'react'
import type { Categoria, Gasto } from '../types'
import { CategoryForm } from './CategoryForm'
import { ExpenseForm } from './ExpenseForm'
import { FRECUENCIAS, formatDate } from '../fomat.ts'
import { fetchApi } from '../api.ts';

interface DashboardProps {
  token: string
  name: string
  onLogout: () => void
}

export function Dashboard({ token, name, onLogout }: DashboardProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    fetchApi('/categories').then(
      setCategorias
    )
  }, [token, onLogout])

  useEffect(() => {
    fetchApi('/expenses').then(
      setGastos
    )
  }, [token, onLogout, recarga])

  return (
    <div>
      <h1>Estás dentro</h1>
      <h2>¡Bienvenido/a {name}!</h2>
      <button onClick={onLogout}>Cerrar sesión</button>

      {categorias.length === 0 && <p>No tienes categorías todavía</p>}
      {categorias.map(c => (
        <span key={c.id} style={{ background: c.color, color: 'white', padding: '4px 10px', marginRight: 8 }}>
          {c.name}
        </span>
      ))}

      <CategoryForm token={token} onCreated={c => setCategorias([...categorias, c])} />
      
      <ExpenseForm token={token} categorias={categorias} onCreated={() => setRecarga(recarga + 1)} />

      <h2>Gastos</h2>
      {gastos.length === 0 && <p>No tienes gastos todavía</p>}
      {gastos.map(g => (
        <div key={g.id}>
          <span style={{ background: g.category_color, color: 'white', padding: '2px 8px', marginRight: 8 }}>
            {g.category_name}
          </span>
          <p>{formatDate(g.date)} · {g.concept ?? 'Sin concepto'} · {g.total} € · {FRECUENCIAS[g.frequency]}</p>
        </div>
      ))}
    </div>
  )
}