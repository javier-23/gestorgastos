import { useState } from 'react'
import { fetchApi } from '../api'

export function Register() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setSuccess(false)

        try{
            await fetchApi('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, name, password })
            })
            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error')
            return
        }
    }

  return (
    <>
      <h1>Registro</h1>
        <form onSubmit={handleSubmit}>
            <input placeholder="Nombre de usuario o correo electrónico" value={username} onChange={e => setUsername(e.target.value)} />
            <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">Crear cuenta</button>
            {success && <p>¡Registro exitoso!</p>}
            {error && <p>{error}</p>}
        </form>
    </>
)
} 