import {useState} from 'react';
import type {Categoria} from '../types.ts';
import { fetchApi } from '../api.ts';

const COLORES = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899']
const ICONOS = ['utensils', 'home', 'shopping-cart', 'car', 'heart', 'gamepad', 'briefcase', 'gift']

interface CategoryFormProps{
    onCreated: (category: Categoria) => void
}

export function CategoryForm({onCreated }: CategoryFormProps) {
    const [name, setCategoryName] = useState('');
    const [color, setSelectedColor] = useState(COLORES[0]);
    const [icon, setSelectedIcon] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');

        try{
            const data = await fetchApi('/categories', {
                method: 'POST',
                body: JSON.stringify({name, color, icon})
            })
            onCreated(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error');
        }
        setCategoryName('');
        setSelectedColor(COLORES[0]);
        setSelectedIcon('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Crear categoría</h1>
            <input required placeholder="Nombre de la categoría" value={name} onChange={(e) => setCategoryName(e.target.value)} />
            <select required value={color} onChange={(e) => setSelectedColor(e.target.value)}>
                {COLORES.map((color) => (
                    <option key={color} value={color}>{color}</option>
                ))}
            </select>
            <select value={icon} onChange={(e) => setSelectedIcon(e.target.value)}>
                {ICONOS.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                ))}
            </select>
            <button type="submit">Crear</button>
            {error && <p>{error}</p>}
        </form>
    )
}