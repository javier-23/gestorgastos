import { useState } from 'react'
import { fetchApi } from '../api'
import { Link } from 'react-router'

interface RegisterProps {
  onRegistered: () => void
}

export function Register({ onRegistered }: RegisterProps) {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')

        try{
            await fetchApi('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, name, password })
            })
            onRegistered()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error')
            return
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <h1>Registro</h1>
        <input
            placeholder="Nombre de usuario" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required
            minLength={3}
            maxLength={30}
        />
        <input 
            placeholder="Nombre" 
            value={name} 
            onChange={e => setName(e.target.value)}
            required
            maxLength={50} 
        />
        <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
            minLength={8}
            maxLength={72}
        />
        <button type="submit">Crear cuenta</button>
        <p>¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
        {error && <p>{error}</p>}
    </form>
)
} 