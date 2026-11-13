export interface Categoria {
  id: number
  name: string
  color: string
  icon: string | null
}

export interface Gasto {
  id: number
  date: string
  total: string
  concept: string | null
  frequency: 'once' | 'weekly' | 'monthly' | 'yearly'
  end_date: string | null
  category_id: number
  category_name: string
  category_color: string
  category_icon: string | null
}

export interface Resumen {
  month: string
  budget: number | null
  spent: number
  remaining: number
  byCategory: {
    id: number
    name: string
    color: string
    total: number
  }[]
}

// Función para cambiar el mes actual en la vista según el delta (1 para siguiente mes, -1 para mes anterior). 
// Usada en summary y useHistorial
export function cambiarMes(mes: string, delta: number) {
  const [year, month] = mes.split('-').map(Number)
  const fecha = new Date(year, month - 1 + delta, 1)
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
}