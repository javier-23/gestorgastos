import { useEffect, useState } from 'react'
import type { Categoria } from '../types'
import { CategoryForm } from '../components/CategoryForm'
import { fetchApi } from '../api'

export function CategoriesPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [editandoCat, setEditandoCat] = useState<Categoria | null>(null)
  const [errorCategoria, setErrorCategoria] = useState('')
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    fetchApi('/categories').then(setCategorias)
  }, [recarga])

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
      <h2>Categorías</h2>
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
    </div>
  )
}