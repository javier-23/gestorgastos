import { z } from 'zod'

export const monthSchema = z.string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'El mes debe tener formato YYYY-MM')

export const budgetSchema = z.object({
  total: z.number().positive('El presupuesto debe ser mayor que 0').max(99999999.99)
})