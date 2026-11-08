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