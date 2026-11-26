export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('es-ES')
}

export const FRECUENCIAS = {
  once: 'Puntual',
  weekly: 'Semanal',
  monthly: 'Mensual',
  yearly: 'Anual'
}

// Función para cambiar el mes actual en la vista según el delta (1 para siguiente mes, -1 para mes anterior). 
// Usada en dashboard y useHistorial
export function cambiarMes(mes: string, delta: number) {
  const [year, month] = mes.split('-').map(Number)
  const fecha = new Date(year, month - 1 + delta, 1)
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
}

// Función para obtener el nombre del mes en formato largo a partir del formato YYYY-MM
export function nombreMes(mes: string) {
  const [year, month] = mes.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  const nombre = date.toLocaleString('es-ES', { month: 'long' })
  return nombre.charAt(0).toUpperCase() + nombre.slice(1)
}