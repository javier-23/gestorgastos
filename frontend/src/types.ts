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