import { useState } from 'react'
import { fetchApi } from '../api'

interface BudgetProps {
  mes: string
  onSaved: () => void
}

export function Budget({ mes, onSaved }: BudgetProps) {
    const [total, setTotal] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setSuccess(false)

        try {
            await fetchApi(`/budgets/${mes}`, {
                method: 'PUT',
                body: JSON.stringify({total: Number(total)}),
            })
            setTotal('')
            setSuccess(true)
            onSaved()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error')
            return
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>Presupuesto</h3>
            <input type="number" min="0.01" step="0.01" placeholder="Presupuesto mes actual" value={total} onChange={e => setTotal(e.target.value)} required />
            <button type="submit">Guardar presupuesto</button>
            {success && <p>¡Presupuesto guardado!</p>}
            {error && <p>{error}</p>}
        </form>
    )
}