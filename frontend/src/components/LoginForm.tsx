import { useState } from 'react'

interface LoginFormProps {
  onLogin: (token: string, name: string) => void // Función con un parámetro de tipo string y sin valor de retorno
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()

    const res = await fetch('http://localhost:1234/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      return
    }

    onLogin(data.token, data.name)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>
      <input placeholder="Usuario" value={username} onChange={e => setUser(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
      {error && <p>{error}</p>}
    </form>
  )
}