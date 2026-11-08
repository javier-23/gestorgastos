import { useState } from 'react'
import {fetchApi} from '../api'

interface LoginFormProps {
  onLogin: (token: string, name: string) => void // Función con un parámetro de tipo string y sin valor de retorno
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    try{
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      })
      onLogin(data.token, data.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
      return
    }
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