import { useState } from 'react'
import { fetchApi } from '../api'

export function Budget() {
    const [budget, setBudget] = useState(0)
    const [month, setMonth] = useState(new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0'))
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setSuccess(false)

        try {
            await fetchApi(`/budget/${month}`, {
                method: 'PUT',
                body: JSON.stringify({budget})
            })
            setBudget(0)
            setMonth('')
            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error')
            return
        }
    }

    return (
        <div>
            <h1>Presupuesto</h1>
            <form onSubmit={handleSubmit}>
            <input type="number" step="100" placeholder="Total" value={budget} onChange={e => setBudget(Number(e.target.value))} />
            <input placeholder="Mes" value={month} onChange={e => setMonth(e.target.value)} />
            <button type="submit">Guardar presupuesto</button>
            {success && <p>¡Presupuesto creado!</p>}
            {error && <p>{error}</p>}
        </form>
        </div>
    )
}