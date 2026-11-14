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
// Usada en summary y useHistorial
export function cambiarMes(mes: string, delta: number) {
  const [year, month] = mes.split('-').map(Number)
  const fecha = new Date(year, month - 1 + delta, 1)
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
}