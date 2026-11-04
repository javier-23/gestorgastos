import { useState, useEffect } from 'react'
import CategoryBadge from './components/CategoryBadge'
import './App.css'

const categories = [
  { id: 1, name: 'Food', color: '#FF5733' },
  { id: 2, name: 'Transport', color: '#33C1FF' },
]

function App() {
  const [count, setCount] = useState(0)
  const [estado, setEstado] = useState('Comprobando...')

  useEffect(() => {
    fetch('http://localhost:1234/health')
      .then(res => res.json())
      .then(data => setEstado(data.status))
      .catch(() => setEstado('Sin conexión'))
  }, [])
  
  return (
    <>
      <h1>Gestor de Gastos</h1>
      <p>API: {estado}</p>
      <div>
        {categories.map(category => (
          <CategoryBadge key={category.id} name={category.name} color={category.color} />
        ))}
      </div>

      <button onClick={() => setCount(count + 1)}>
        Count is {count}
      </button>
    </>
  )
}

export default App
