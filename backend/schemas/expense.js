import {z} from 'zod'

export const expenseSchema = z.object({
    date: z.iso.date('La fecha debe estar en formato YYYY-MM-DD'),
    total: z.number().positive('El total debe ser un número positivo').max(1000000, 'El total no puede ser mayor a 1 millón'),
    concept: z.string().trim().max(255).optional(),
    id_category: z.number().int().positive('El id_category debe ser un número entero positivo'),
    frequency: z.enum(['once', 'weekly', 'monthly', 'yearly']).default('once'),
    end_date: z.iso.date().nullish().optional()
  })
  .refine(d => !d.end_date || d.end_date >= d.date, {
    message: 'end_date no puede ser anterior a date',
    path: ['end_date']
  })
  .refine(d => d.frequency !== 'once' || !d.end_date, {
    message: 'Un gasto puntual no puede tener end_date',
    path: ['end_date']
  })

// Validar filtro 
export const expenseFiltersSchema = z.object({
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
  category: z.coerce.number().int().positive().optional()
})

export const occurrencesFiltersSchema = z.object({
  from: z.iso.date(),
  to: z.iso.date(),
  category: z.coerce.number().int().positive().optional()
})

