import {useState} from 'react';
import type {Categoria} from '../types.ts';
import { fetchApi } from '../api.ts';

const COLORES = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899']
const ICONOS = ['utensils', 'home', 'shopping-cart', 'car', 'heart', 'gamepad', 'briefcase', 'gift']

interface CategoryFormProps{
    categoria?: Categoria | null
    onSaved: () => void
    onCancel?: () => void
}

export function CategoryForm({categoria, onSaved, onCancel}: CategoryFormProps) {
    const [name, setName] = useState(categoria?.name ?? '')
    const [color, setColor] = useState(categoria?.color ?? COLORES[0])
    const [icon, setIcon] = useState(categoria?.icon ?? ICONOS[0])
    const [error, setError] = useState('')

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');

        try {
            await fetchApi(categoria ? `/categories/${categoria.id}` : '/categories', {
                method: categoria ? 'PUT' : 'POST',
                body: JSON.stringify({ name, color, icon })
        })
            setName('')
            setColor(COLORES[0])
            setIcon(ICONOS[0])
            onSaved()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>{categoria ? 'Editar categoría' : 'Crear categoría'}</h1>
            <input required placeholder="Nombre de la categoría" value={name} onChange={(e) => setName(e.target.value)} />
            <select required value={color} onChange={(e) => setColor(e.target.value)}>
                {COLORES.map((color) => (
                    <option key={color} value={color}>{color}</option>
                ))}
            </select>
            <select value={icon} onChange={(e) => setIcon(e.target.value)}>
                {ICONOS.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                ))}
            </select>
            <button type="submit">Crear</button>
            {categoria && onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
            {error && <p>{error}</p>}
        </form>
    )
}