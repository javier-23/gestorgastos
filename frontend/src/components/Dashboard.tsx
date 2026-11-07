import { useEffect, useState } from 'react'
import type { Categoria } from '../types'
import { CategoryForm } from './CategoryForm'

interface DashboardProps {
  token: string
  name: string
  onLogout: () => void
}

export function Dashboard({ token, name, onLogout }: DashboardProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([])

  useEffect(() => {
    fetch('http://localhost:1234/categories', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(async res => {
      if (res.status === 401) {
        onLogout()
        return
      }
      setCategorias(await res.json())
    })
  }, [token, onLogout])

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
    </div>
  )
}