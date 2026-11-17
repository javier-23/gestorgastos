// Componente para mostrar cuanto ha cambiado un valor, y si es positivo y negativo
export function Comparasion({ diff, mes, subirEsBueno }: { diff: number, mes: string, subirEsBueno: boolean }) {

    const verde = '#377939'
    const rojo = '#942f27'
    const color = (subirEsBueno ? ( diff > 0 ? verde : rojo) : ( diff < 0 ? verde : rojo))
    const icono = (subirEsBueno ? ( diff > 0 ? '▲' : '▼') : ( diff < 0 ? '▼' : '▲'))

    return(
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: color, color: 'white', padding: 4, borderRadius: 14 }}>
            <span>{icono} {Math.round(diff)}% vs {mes}</span>
        </div>
    )
}